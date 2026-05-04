from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    AccessRequest,
    Contact,
    ContactMessage,
    DocsArticle,
    IndexDefinition,
    IndexValue,
    MethodologyVersion,
    Organization,
    PageContent,
    ProductDefinition,
    RFQRequest,
    SupplierQuote,
    TokenPackage,
)
from app.schemas import (
    APIMessage,
    AccessRequestCreate,
    AccessRequestOut,
    ContactMessageCreate,
    ContactMessageOut,
    DocsArticleOut,
    IndexValueOut,
    MethodologyOut,
    PageContentOut,
    ProductDefinitionOut,
    PublicIndexOut,
    RFQCreate,
    RFQOut,
    SiteConfigOut,
    SiteNavItem,
    SupplierApplicationCreate,
    TokenPackageOut,
)
from app.services.email_service import EmailService

router = APIRouter(prefix="/api", tags=["public"])


def _fallback_locale(locale: str | None) -> str:
    return locale or "en"


def _get_page_or_404(slug: str, locale: str, db: Session) -> PageContent:
    page = db.scalar(
        select(PageContent).where(
            PageContent.slug == slug,
            PageContent.locale == locale,
            PageContent.is_published.is_(True),
        )
    )
    if not page and locale != "en":
        page = db.scalar(
            select(PageContent).where(
                PageContent.slug == slug,
                PageContent.locale == "en",
                PageContent.is_published.is_(True),
            )
        )
    if not page:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    return page


def _public_indices(db: Session) -> list[PublicIndexOut]:
    index_defs = list(
        db.scalars(
            select(IndexDefinition)
            .where(IndexDefinition.is_public.is_(True))
            .order_by(IndexDefinition.family.asc().nulls_last(), IndexDefinition.symbol.asc())
        ).all()
    )
    output: list[PublicIndexOut] = []
    for item in index_defs:
        latest = db.scalar(
            select(IndexValue)
            .where(IndexValue.index_id == item.id)
            .order_by(desc(IndexValue.timestamp))
            .limit(1)
        )
        output.append(
            PublicIndexOut(
                symbol=item.symbol,
                name=item.name,
                family=item.family,
                description=item.description,
                methodology_version=item.methodology_version,
                unit=item.unit,
                latest=latest,
            )
        )
    return output


@router.get("/site/config", response_model=SiteConfigOut)
def get_site_config(locale: str = "en", db: Session = Depends(get_db)):
    pages = list(
        db.scalars(
            select(PageContent)
            .where(
                PageContent.locale == locale,
                PageContent.is_published.is_(True),
                PageContent.is_nav_visible.is_(True),
            )
            .order_by(PageContent.sort_order.asc())
        ).all()
    )
    nav = [SiteNavItem(slug=p.slug, label=p.nav_label, href="/" if p.slug == "home" else f"/{p.slug}", sort_order=p.sort_order) for p in pages]
    return SiteConfigOut(
        brand="NEXUM",
        tagline="A market infrastructure for token-based model demand and supply.",
        locales=["en", "zh", "ko"],
        navigation=nav,
        cta={"primary": "Request Access", "secondary": "Request Quote"},
    )


@router.get("/pages", response_model=list[PageContentOut])
def list_pages(locale: str = "en", db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(PageContent)
            .where(PageContent.locale == locale, PageContent.is_published.is_(True))
            .order_by(PageContent.sort_order.asc())
        ).all()
    )


@router.get("/pages/home", response_model=PageContentOut)
def get_home_page(locale: str = "en", db: Session = Depends(get_db)):
    return get_page("home", locale, db)


@router.get("/pages/{slug}", response_model=PageContentOut)
def get_page(slug: str, locale: str = "en", db: Session = Depends(get_db)):
    return _get_page_or_404(slug, _fallback_locale(locale), db)


@router.get("/products", response_model=list[ProductDefinitionOut])
def list_products(db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(ProductDefinition)
            .where(ProductDefinition.is_public.is_(True))
            .order_by(desc(ProductDefinition.is_featured), ProductDefinition.name.asc())
        ).all()
    )


@router.get("/products/featured", response_model=ProductDefinitionOut)
def get_featured_product(db: Session = Depends(get_db)):
    product = db.scalar(
        select(ProductDefinition)
        .where(ProductDefinition.is_public.is_(True), ProductDefinition.is_featured.is_(True))
        .order_by(ProductDefinition.created_at.asc())
        .limit(1)
    )
    if not product:
        product = db.scalar(select(ProductDefinition).where(ProductDefinition.is_public.is_(True)).limit(1))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No public product found.")
    return product


@router.get("/products/{slug}", response_model=ProductDefinitionOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.scalar(select(ProductDefinition).where(ProductDefinition.slug == slug, ProductDefinition.is_public.is_(True)))
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return product


@router.get("/indices", response_model=list[PublicIndexOut])
def list_indices(db: Session = Depends(get_db)):
    return _public_indices(db)


@router.get("/indices/{symbol}", response_model=PublicIndexOut)
def get_index(symbol: str, db: Session = Depends(get_db)):
    index_def = db.scalar(
        select(IndexDefinition).where(IndexDefinition.symbol == symbol, IndexDefinition.is_public.is_(True))
    )
    if not index_def:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Index not found.")
    latest = db.scalar(
        select(IndexValue)
        .where(IndexValue.index_id == index_def.id)
        .order_by(desc(IndexValue.timestamp))
        .limit(1)
    )
    return PublicIndexOut(
        symbol=index_def.symbol,
        name=index_def.name,
        family=index_def.family,
        description=index_def.description,
        methodology_version=index_def.methodology_version,
        unit=index_def.unit,
        latest=latest,
    )


@router.get("/indices/{symbol}/history", response_model=list[IndexValueOut])
def get_index_history(
    symbol: str,
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    index_def = db.scalar(
        select(IndexDefinition).where(IndexDefinition.symbol == symbol, IndexDefinition.is_public.is_(True))
    )
    if not index_def:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Index not found.")

    return list(
        db.scalars(
            select(IndexValue)
            .where(IndexValue.index_id == index_def.id)
            .order_by(desc(IndexValue.timestamp))
            .limit(limit)
        ).all()
    )


@router.get("/markets/objects")
def get_market_objects(db: Session = Depends(get_db)):
    page = db.scalar(select(PageContent).where(PageContent.slug == "markets", PageContent.locale == "en", PageContent.is_published.is_(True)))
    if not page:
        return {"objects": []}
    return {"objects": page.body_json.get("market_objects", []), "participants": page.body_json.get("participants", [])}


@router.get("/token-packages", response_model=list[TokenPackageOut])
def list_public_token_packages(db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(TokenPackage)
            .where(TokenPackage.is_public.is_(True))
            .order_by(TokenPackage.price_usd.asc().nulls_last())
        ).all()
    )


@router.get("/methodology/latest", response_model=MethodologyOut)
def get_latest_methodology(db: Session = Depends(get_db)):
    item = db.scalar(
        select(MethodologyVersion)
        .where(MethodologyVersion.status == "active")
        .order_by(desc(MethodologyVersion.effective_date), desc(MethodologyVersion.created_at))
        .limit(1)
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active methodology found.")
    return item


@router.get("/docs", response_model=list[DocsArticleOut])
def list_docs(category: str | None = None, db: Session = Depends(get_db)):
    stmt = select(DocsArticle).where(DocsArticle.is_public.is_(True)).order_by(DocsArticle.category.asc(), DocsArticle.sort_order.asc())
    if category:
        stmt = stmt.where(DocsArticle.category == category)
    return list(db.scalars(stmt).all())


@router.get("/docs/{slug}", response_model=DocsArticleOut)
def get_doc(slug: str, db: Session = Depends(get_db)):
    article = db.scalar(select(DocsArticle).where(DocsArticle.slug == slug, DocsArticle.is_public.is_(True)))
    if not article:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doc article not found.")
    return article



@router.get("/site/map")
def get_site_map(locale: str = "en", db: Session = Depends(get_db)):
    """Return all routes the current public site expects to work.

    The preview frontend and the Manus frontend can use this endpoint to check
    whether every visible navigation route has a backend data source.
    """
    pages = list(
        db.scalars(
            select(PageContent)
            .where(PageContent.locale == locale, PageContent.is_published.is_(True))
            .order_by(PageContent.sort_order.asc())
        ).all()
    )
    docs = list(db.scalars(select(DocsArticle).where(DocsArticle.is_public.is_(True)).order_by(DocsArticle.sort_order.asc())).all())
    products = list(db.scalars(select(ProductDefinition).where(ProductDefinition.is_public.is_(True)).order_by(ProductDefinition.name.asc())).all())
    return {
        "public_pages": [
            {"slug": p.slug, "href": "/" if p.slug == "home" else f"/{p.slug}", "api": f"/api/pages/{p.slug}"}
            for p in pages
        ],
        "product_detail_pages": [
            {"slug": p.slug, "href": f"/product/{p.slug}", "api": f"/api/products/{p.slug}"}
            for p in products
        ],
        "docs_detail_pages": [
            {"slug": d.slug, "href": f"/docs/{d.slug}", "api": f"/api/docs/{d.slug}"}
            for d in docs
        ],
        "form_pages": [
            {"slug": "access", "href": "/access", "api": "/api/access-requests"},
            {"slug": "request-access", "href": "/request-access", "api": "/api/access-requests"},
            {"slug": "quote", "href": "/quote", "api": "/api/rfq"},
            {"slug": "request-quote", "href": "/request-quote", "api": "/api/rfq"},
            {"slug": "supplier", "href": "/supplier", "api": "/api/supplier/apply"},
        ],
        "admin_entry": {"href": "/_docs", "api": "/api/admin/dashboard"},
    }


@router.get("/pages/{slug}/bundle")
def get_page_bundle(slug: str, locale: str = "en", db: Session = Depends(get_db)):
    page = _get_page_or_404(slug, _fallback_locale(locale), db)
    payload: dict = {"page": PageContentOut.model_validate(page).model_dump(mode="json")}
    if slug in {"home", "product"}:
        featured = db.scalar(
            select(ProductDefinition)
            .where(ProductDefinition.is_public.is_(True), ProductDefinition.is_featured.is_(True))
            .order_by(ProductDefinition.created_at.asc())
            .limit(1)
        )
        payload["featured_product"] = ProductDefinitionOut.model_validate(featured).model_dump(mode="json") if featured else None
    if slug in {"home", "indices", "markets"}:
        payload["indices"] = [item.model_dump(mode="json") for item in _public_indices(db)]
    if slug == "docs":
        docs = list(db.scalars(select(DocsArticle).where(DocsArticle.is_public.is_(True)).order_by(DocsArticle.category.asc(), DocsArticle.sort_order.asc())).all())
        payload["docs"] = [DocsArticleOut.model_validate(item).model_dump(mode="json") for item in docs]
    if slug == "methodology":
        item = db.scalar(
            select(MethodologyVersion)
            .where(MethodologyVersion.status == "active")
            .order_by(desc(MethodologyVersion.effective_date), desc(MethodologyVersion.created_at))
            .limit(1)
        )
        payload["methodology"] = MethodologyOut.model_validate(item).model_dump(mode="json") if item else None
    return payload


@router.get("/markets")
def get_markets_overview(locale: str = "en", db: Session = Depends(get_db)):
    page = _get_page_or_404("markets", _fallback_locale(locale), db)
    return {
        "page": PageContentOut.model_validate(page).model_dump(mode="json"),
        "objects": page.body_json.get("market_objects", []),
        "participants": page.body_json.get("participants", []),
        "indices": [item.model_dump(mode="json") for item in _public_indices(db)],
    }


@router.post("/request-quote", response_model=RFQOut, status_code=status.HTTP_201_CREATED)
def create_request_quote_alias(payload: RFQCreate, db: Session = Depends(get_db)):
    return create_rfq(payload, db)


@router.post("/request-access", response_model=AccessRequestOut, status_code=status.HTTP_201_CREATED)
def create_request_access_alias(payload: AccessRequestCreate, db: Session = Depends(get_db)):
    return create_access_request(payload, db)


@router.get("/form-options")
def get_form_options():
    return {
        "topics": ["Product Access", "Pricing", "Token Packages", "Indices", "Markets", "Partnerships", "Integration", "General Inquiry"],
        "request_types": ["token_package", "gpu_hour", "model_api", "custom"],
        "models": ["Qwen3.5-32B", "Qwen", "GLM", "Kimi", "Open model basket", "Custom"],
        "regions": ["Global", "US", "Europe", "Asia", "China-compatible routing", "Custom"],
        "service_classes": ["Standard", "Priority", "Dedicated", "Custom"],
    }


@router.post("/rfq", response_model=RFQOut, status_code=status.HTTP_201_CREATED)
def create_rfq(payload: RFQCreate, db: Session = Depends(get_db)):
    organization = None
    if payload.company_name:
        organization = Organization(name=payload.company_name, type="buyer")
        db.add(organization)
        db.flush()

    contact = Contact(
        organization_id=organization.id if organization else None,
        name=payload.contact_name,
        email=str(payload.contact_email),
        source="rfq_form",
    )
    db.add(contact)
    db.flush()

    rfq = RFQRequest(
        organization_id=organization.id if organization else None,
        contact_id=contact.id,
        request_type=payload.request_type,
        product_slug=payload.product_slug,
        company_name=payload.company_name,
        contact_name=payload.contact_name,
        contact_email=str(payload.contact_email),
        contact_channel=payload.contact_channel,
        model_name=payload.model_name,
        input_tokens_per_month=payload.input_tokens_per_month,
        output_tokens_per_month=payload.output_tokens_per_month,
        package_quantity=payload.package_quantity,
        gpu_type=payload.gpu_type,
        region=payload.region,
        latency_requirement=payload.latency_requirement,
        budget_usd=payload.budget_usd,
        delivery_deadline=payload.delivery_deadline,
        use_case=payload.use_case,
        notes=payload.notes,
    )
    db.add(rfq)
    db.commit()
    db.refresh(rfq)

    email_service = EmailService()
    email_service.send_customer_rfq_confirmation(rfq)
    email_service.send_internal_rfq_alert(rfq)

    return rfq


@router.post("/access-requests", response_model=AccessRequestOut, status_code=status.HTTP_201_CREATED)
def create_access_request(payload: AccessRequestCreate, db: Session = Depends(get_db)):
    item = AccessRequest(**payload.model_dump(mode="json"))
    db.add(item)
    db.commit()
    db.refresh(item)

    email_service = EmailService()
    email_service.send_internal_access_alert(item)
    return item


@router.post("/contact", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def create_contact_message(payload: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessage(email=str(payload.email), topic=payload.topic, message=payload.message)
    db.add(message)
    db.commit()
    db.refresh(message)

    email_service = EmailService()
    email_service.send_internal_contact_alert(message)
    return message


@router.post("/supplier/apply", response_model=APIMessage, status_code=status.HTTP_201_CREATED)
def supplier_apply(payload: SupplierApplicationCreate, db: Session = Depends(get_db)):
    org = Organization(
        name=payload.supplier_name,
        type="supplier",
        country=payload.country,
        website=payload.website,
        description=payload.notes,
    )
    db.add(org)
    db.flush()

    contact = Contact(
        organization_id=org.id,
        name=payload.contact_name,
        email=str(payload.contact_email),
        source="supplier_application",
    )
    db.add(contact)

    if payload.price is not None:
        quote = SupplierQuote(
            supplier_org_id=org.id,
            supplier_name=payload.supplier_name,
            resource_type=payload.resource_type,
            model_name=payload.model_name,
            gpu_type=payload.gpu_type,
            region=payload.region,
            unit=payload.unit,
            price=payload.price,
            currency=payload.currency,
            minimum_commitment=payload.minimum_commitment,
            available_capacity=payload.available_capacity,
            valid_until=payload.valid_until,
            source_type="partner",
            confidence_score=0.5,
        )
        db.add(quote)

    db.commit()
    return APIMessage(message="Supplier application received.")
