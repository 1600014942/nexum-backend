from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    AccessRequest,
    AuditLog,
    CommercialQuote,
    ContactMessage,
    DocsArticle,
    IndexDefinition,
    MethodologyVersion,
    PageContent,
    PriceObservation,
    ProductDefinition,
    RFQRequest,
    SupplierQuote,
    TokenPackage,
)
from app.schemas import (
    AccessRequestOut,
    APIMessage,
    CommercialQuoteCreate,
    CommercialQuoteOut,
    CommercialQuoteUpdate,
    ContactMessageOut,
    DashboardSummaryOut,
    DocsArticleCreate,
    DocsArticleOut,
    DocsArticleUpdate,
    IndexDefinitionCreate,
    IndexDefinitionOut,
    IndexDefinitionUpdate,
    IndexValueOut,
    MethodologyCreate,
    MethodologyOut,
    MethodologyUpdate,
    PageContentCreate,
    PageContentOut,
    PageContentUpdate,
    PriceObservationCreate,
    PriceObservationOut,
    PriceObservationUpdate,
    ProductDefinitionCreate,
    ProductDefinitionOut,
    ProductDefinitionUpdate,
    RFQOut,
    RFQStatusUpdate,
    SupplierQuoteCreate,
    SupplierQuoteOut,
    SupplierQuoteUpdate,
    TokenPackageCreate,
    TokenPackageOut,
    TokenPackageUpdate,
)
from app.security import require_admin
from app.services.index_service import IndexCalculationError, IndexCalculationService

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])


def audit(db: Session, action: str, target_table: str, target_id: str | None, before: dict | None, after: dict | None) -> None:
    db.add(
        AuditLog(
            actor="admin_api",
            action=action,
            target_table=target_table,
            target_id=target_id,
            before_json=before,
            after_json=after,
        )
    )


def _patch_model(item, payload) -> dict:
    data = payload.model_dump(exclude_unset=True, mode="json")
    for key, value in data.items():
        setattr(item, key, value)
    return data


@router.get("/dashboard", response_model=DashboardSummaryOut)
def dashboard(db: Session = Depends(get_db)):
    return DashboardSummaryOut(
        rfq_count=db.scalar(select(func.count()).select_from(RFQRequest)) or 0,
        new_rfq_count=db.scalar(select(func.count()).select_from(RFQRequest).where(RFQRequest.status == "new")) or 0,
        access_request_count=db.scalar(select(func.count()).select_from(AccessRequest)) or 0,
        contact_message_count=db.scalar(select(func.count()).select_from(ContactMessage)) or 0,
        supplier_quote_count=db.scalar(select(func.count()).select_from(SupplierQuote)) or 0,
        price_observation_count=db.scalar(select(func.count()).select_from(PriceObservation)) or 0,
        public_index_count=db.scalar(select(func.count()).select_from(IndexDefinition).where(IndexDefinition.is_public.is_(True))) or 0,
        public_product_count=db.scalar(select(func.count()).select_from(ProductDefinition).where(ProductDefinition.is_public.is_(True))) or 0,
    )


# ------------------------- Content / CMS -------------------------


@router.get("/pages", response_model=list[PageContentOut])
def admin_list_pages(locale: str | None = None, db: Session = Depends(get_db)):
    stmt = select(PageContent).order_by(PageContent.locale.asc(), PageContent.sort_order.asc())
    if locale:
        stmt = stmt.where(PageContent.locale == locale)
    return list(db.scalars(stmt).all())


@router.post("/pages", response_model=PageContentOut, status_code=status.HTTP_201_CREATED)
def admin_create_page(payload: PageContentCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(PageContent).where(PageContent.slug == payload.slug, PageContent.locale == payload.locale))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Page slug and locale already exist.")
    item = PageContent(**payload.model_dump(mode="json"))
    db.add(item)
    db.flush()
    audit(db, "create", "page_contents", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/pages/{page_id}", response_model=PageContentOut)
def admin_update_page(page_id: str, payload: PageContentUpdate, db: Session = Depends(get_db)):
    item = db.get(PageContent, page_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Page not found.")
    before = {"title": item.title, "is_published": item.is_published, "body_json": item.body_json}
    after = _patch_model(item, payload)
    audit(db, "update", "page_contents", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


@router.get("/products", response_model=list[ProductDefinitionOut])
def admin_list_products(db: Session = Depends(get_db)):
    return list(db.scalars(select(ProductDefinition).order_by(desc(ProductDefinition.is_featured), ProductDefinition.name.asc())).all())


@router.post("/products", response_model=ProductDefinitionOut, status_code=status.HTTP_201_CREATED)
def admin_create_product(payload: ProductDefinitionCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(ProductDefinition).where(ProductDefinition.slug == payload.slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Product slug already exists.")
    item = ProductDefinition(**payload.model_dump(mode="json"))
    db.add(item)
    db.flush()
    audit(db, "create", "product_definitions", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/products/{product_id}", response_model=ProductDefinitionOut)
def admin_update_product(product_id: str, payload: ProductDefinitionUpdate, db: Session = Depends(get_db)):
    item = db.get(ProductDefinition, product_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    before = {"name": item.name, "status": item.status, "is_public": item.is_public, "is_featured": item.is_featured}
    after = _patch_model(item, payload)
    audit(db, "update", "product_definitions", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


@router.get("/docs", response_model=list[DocsArticleOut])
def admin_list_docs(db: Session = Depends(get_db)):
    return list(db.scalars(select(DocsArticle).order_by(DocsArticle.category.asc(), DocsArticle.sort_order.asc())).all())


@router.post("/docs", response_model=DocsArticleOut, status_code=status.HTTP_201_CREATED)
def admin_create_doc(payload: DocsArticleCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(DocsArticle).where(DocsArticle.slug == payload.slug))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Doc slug already exists.")
    item = DocsArticle(**payload.model_dump(mode="json"))
    db.add(item)
    db.flush()
    audit(db, "create", "docs_articles", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/docs/{doc_id}", response_model=DocsArticleOut)
def admin_update_doc(doc_id: str, payload: DocsArticleUpdate, db: Session = Depends(get_db)):
    item = db.get(DocsArticle, doc_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doc not found.")
    before = {"title": item.title, "is_public": item.is_public}
    after = _patch_model(item, payload)
    audit(db, "update", "docs_articles", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


# ------------------------- Demand intake -------------------------


@router.get("/rfqs", response_model=list[RFQOut])
def list_rfqs(
    status_filter: str | None = Query(default=None, alias="status"),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    stmt = select(RFQRequest).order_by(desc(RFQRequest.created_at)).limit(limit)
    if status_filter:
        stmt = stmt.where(RFQRequest.status == status_filter)
    return list(db.scalars(stmt).all())


@router.patch("/rfqs/{rfq_id}/status", response_model=RFQOut)
def update_rfq_status(rfq_id: str, payload: RFQStatusUpdate, db: Session = Depends(get_db)):
    rfq = db.get(RFQRequest, rfq_id)
    if not rfq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found.")

    before = {"status": rfq.status, "notes": rfq.notes}
    rfq.status = payload.status
    if payload.notes:
        rfq.notes = f"{rfq.notes or ''}\n{payload.notes}".strip()
    after = {"status": rfq.status, "notes": rfq.notes}
    audit(db, "update_status", "rfq_requests", rfq.id, before, after)
    db.commit()
    db.refresh(rfq)
    return rfq


@router.get("/access-requests", response_model=list[AccessRequestOut])
def list_access_requests(limit: int = Query(default=200, ge=1, le=2000), db: Session = Depends(get_db)):
    return list(db.scalars(select(AccessRequest).order_by(desc(AccessRequest.created_at)).limit(limit)).all())


@router.patch("/access-requests/{request_id}/status", response_model=AccessRequestOut)
def update_access_status(request_id: str, payload: RFQStatusUpdate, db: Session = Depends(get_db)):
    item = db.get(AccessRequest, request_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Access request not found.")
    before = {"status": item.status}
    item.status = payload.status
    audit(db, "update_status", "access_requests", item.id, before, {"status": item.status, "notes": payload.notes})
    db.commit()
    db.refresh(item)
    return item


@router.get("/contact-messages", response_model=list[ContactMessageOut])
def list_contact_messages(limit: int = Query(default=200, ge=1, le=2000), db: Session = Depends(get_db)):
    return list(db.scalars(select(ContactMessage).order_by(desc(ContactMessage.created_at)).limit(limit)).all())


@router.patch("/contact-messages/{message_id}/status", response_model=ContactMessageOut)
def update_contact_message_status(message_id: str, payload: RFQStatusUpdate, db: Session = Depends(get_db)):
    item = db.get(ContactMessage, message_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found.")
    before = {"status": item.status}
    item.status = payload.status
    audit(db, "update_status", "contact_messages", item.id, before, {"status": item.status, "notes": payload.notes})
    db.commit()
    db.refresh(item)
    return item


# ------------------------- Price database / index layer -------------------------


@router.get("/price-observations", response_model=list[PriceObservationOut])
def list_price_observations(
    asset_type: str | None = None,
    asset_name: str | None = None,
    limit: int = Query(default=200, ge=1, le=2000),
    db: Session = Depends(get_db),
):
    stmt = select(PriceObservation).order_by(desc(PriceObservation.sample_time)).limit(limit)
    if asset_type:
        stmt = stmt.where(PriceObservation.asset_type == asset_type)
    if asset_name:
        stmt = stmt.where(PriceObservation.asset_name == asset_name)
    return list(db.scalars(stmt).all())


@router.post("/price-observations", response_model=PriceObservationOut, status_code=status.HTTP_201_CREATED)
def create_price_observation(payload: PriceObservationCreate, db: Session = Depends(get_db)):
    data = payload.model_dump()
    if data.get("sample_time") is None:
        data.pop("sample_time")
    item = PriceObservation(**data)
    db.add(item)
    db.flush()
    audit(db, "create", "price_observations", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/price-observations/{observation_id}", response_model=PriceObservationOut)
def update_price_observation(observation_id: str, payload: PriceObservationUpdate, db: Session = Depends(get_db)):
    item = db.get(PriceObservation, observation_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Price observation not found.")
    before = {"asset_name": item.asset_name, "price_usd": item.price_usd, "confidence_score": item.confidence_score}
    after = _patch_model(item, payload)
    audit(db, "update", "price_observations", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/price-observations/{observation_id}", response_model=APIMessage)
def delete_price_observation(observation_id: str, db: Session = Depends(get_db)):
    item = db.get(PriceObservation, observation_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Price observation not found.")
    audit(db, "delete", "price_observations", item.id, {"asset_name": item.asset_name, "price_usd": item.price_usd}, None)
    db.delete(item)
    db.commit()
    return APIMessage(message="Price observation deleted.")


@router.post("/price-observations/import", response_model=list[PriceObservationOut], status_code=status.HTTP_201_CREATED)
def import_price_observations(payload: list[PriceObservationCreate], db: Session = Depends(get_db)):
    if len(payload) > 1000:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum batch size is 1000.")

    items: list[PriceObservation] = []
    for row in payload:
        data = row.model_dump()
        if data.get("sample_time") is None:
            data.pop("sample_time")
        item = PriceObservation(**data)
        db.add(item)
        items.append(item)
    db.flush()
    audit(db, "bulk_import", "price_observations", None, None, {"count": len(items)})
    db.commit()
    for item in items:
        db.refresh(item)
    return items


@router.get("/supplier-quotes", response_model=list[SupplierQuoteOut])
def list_supplier_quotes(
    resource_type: str | None = None,
    limit: int = Query(default=200, ge=1, le=2000),
    db: Session = Depends(get_db),
):
    stmt = select(SupplierQuote).order_by(desc(SupplierQuote.created_at)).limit(limit)
    if resource_type:
        stmt = stmt.where(SupplierQuote.resource_type == resource_type)
    return list(db.scalars(stmt).all())


@router.post("/supplier-quotes", response_model=SupplierQuoteOut, status_code=status.HTTP_201_CREATED)
def create_supplier_quote(payload: SupplierQuoteCreate, db: Session = Depends(get_db)):
    item = SupplierQuote(**payload.model_dump())
    db.add(item)
    db.flush()
    audit(db, "create", "supplier_quotes", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/supplier-quotes/{quote_id}", response_model=SupplierQuoteOut)
def update_supplier_quote(quote_id: str, payload: SupplierQuoteUpdate, db: Session = Depends(get_db)):
    item = db.get(SupplierQuote, quote_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier quote not found.")
    before = {"price": item.price, "confidence_score": item.confidence_score, "source_type": item.source_type}
    after = _patch_model(item, payload)
    audit(db, "update", "supplier_quotes", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/supplier-quotes/{quote_id}", response_model=APIMessage)
def delete_supplier_quote(quote_id: str, db: Session = Depends(get_db)):
    item = db.get(SupplierQuote, quote_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supplier quote not found.")
    audit(db, "delete", "supplier_quotes", item.id, {"supplier_name": item.supplier_name, "price": item.price}, None)
    db.delete(item)
    db.commit()
    return APIMessage(message="Supplier quote deleted.")


@router.get("/index-definitions", response_model=list[IndexDefinitionOut])
def list_index_definitions(db: Session = Depends(get_db)):
    return list(db.scalars(select(IndexDefinition).order_by(IndexDefinition.symbol.asc())).all())


@router.post("/index-definitions", response_model=IndexDefinitionOut, status_code=status.HTTP_201_CREATED)
def create_index_definition(payload: IndexDefinitionCreate, db: Session = Depends(get_db)):
    existing = db.scalar(select(IndexDefinition).where(IndexDefinition.symbol == payload.symbol))
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Index symbol already exists.")
    item = IndexDefinition(**payload.model_dump())
    db.add(item)
    db.flush()
    audit(db, "create", "index_definitions", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/index-definitions/{index_id}", response_model=IndexDefinitionOut)
def update_index_definition(index_id: str, payload: IndexDefinitionUpdate, db: Session = Depends(get_db)):
    item = db.get(IndexDefinition, index_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Index definition not found.")
    before = {"name": item.name, "is_public": item.is_public, "asset_filter": item.asset_filter}
    after = _patch_model(item, payload)
    audit(db, "update", "index_definitions", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


@router.post("/indices/{symbol}/recalculate", response_model=IndexValueOut)
def recalculate_index(symbol: str, db: Session = Depends(get_db)):
    service = IndexCalculationService()
    try:
        return service.recalculate_by_symbol(db, symbol)
    except IndexCalculationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/indices/recalculate-all", response_model=list[IndexValueOut])
def recalculate_all_indices(db: Session = Depends(get_db)):
    service = IndexCalculationService()
    try:
        return service.recalculate_all_public(db)
    except IndexCalculationError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


# ------------------------- Legacy token package table -------------------------


@router.get("/token-packages", response_model=list[TokenPackageOut])
def list_token_packages(db: Session = Depends(get_db)):
    return list(db.scalars(select(TokenPackage).order_by(desc(TokenPackage.created_at))).all())


@router.post("/token-packages", response_model=TokenPackageOut, status_code=status.HTTP_201_CREATED)
def create_token_package(payload: TokenPackageCreate, db: Session = Depends(get_db)):
    item = TokenPackage(**payload.model_dump())
    db.add(item)
    db.flush()
    audit(db, "create", "token_packages", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/token-packages/{package_id}", response_model=TokenPackageOut)
def update_token_package(package_id: str, payload: TokenPackageUpdate, db: Session = Depends(get_db)):
    item = db.get(TokenPackage, package_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token package not found.")

    before = {"name": item.name, "price_usd": item.price_usd, "is_public": item.is_public}
    after = _patch_model(item, payload)
    audit(db, "update", "token_packages", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


# ------------------------- Methodology / quote desk -------------------------


@router.get("/methodologies", response_model=list[MethodologyOut])
def list_methodologies(db: Session = Depends(get_db)):
    return list(
        db.scalars(
            select(MethodologyVersion).order_by(desc(MethodologyVersion.effective_date), desc(MethodologyVersion.created_at))
        ).all()
    )


@router.post("/methodologies", response_model=MethodologyOut, status_code=status.HTTP_201_CREATED)
def create_methodology(payload: MethodologyCreate, db: Session = Depends(get_db)):
    data = payload.model_dump()
    if data.get("effective_date") is None:
        data.pop("effective_date")
    item = MethodologyVersion(**data)
    db.add(item)
    db.flush()
    audit(db, "create", "methodology_versions", item.id, None, payload.model_dump(mode="json"))
    db.commit()
    db.refresh(item)
    return item


@router.patch("/methodologies/{methodology_id}", response_model=MethodologyOut)
def update_methodology(methodology_id: str, payload: MethodologyUpdate, db: Session = Depends(get_db)):
    item = db.get(MethodologyVersion, methodology_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Methodology not found.")
    before = {"title": item.title, "status": item.status, "effective_date": str(item.effective_date)}
    after = _patch_model(item, payload)
    audit(db, "update", "methodology_versions", item.id, before, after)
    db.commit()
    db.refresh(item)
    return item


def _next_quote_number(db: Session) -> str:
    existing_count = db.query(CommercialQuote).count() + 1
    return f"NEX-Q-{existing_count:06d}"


@router.get("/quotes", response_model=list[CommercialQuoteOut])
def list_commercial_quotes(
    status_filter: str | None = Query(default=None, alias="status"),
    limit: int = Query(default=200, ge=1, le=2000),
    db: Session = Depends(get_db),
):
    stmt = select(CommercialQuote).order_by(desc(CommercialQuote.created_at)).limit(limit)
    if status_filter:
        stmt = stmt.where(CommercialQuote.status == status_filter)
    return list(db.scalars(stmt).all())


@router.post("/rfqs/{rfq_id}/quotes", response_model=CommercialQuoteOut, status_code=status.HTTP_201_CREATED)
def create_commercial_quote_for_rfq(rfq_id: str, payload: CommercialQuoteCreate, db: Session = Depends(get_db)):
    rfq = db.get(RFQRequest, rfq_id)
    if not rfq:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="RFQ not found.")

    subtotal = sum(item.quantity * item.unit_price_usd for item in payload.line_items)
    item = CommercialQuote(
        rfq_id=rfq.id,
        quote_number=_next_quote_number(db),
        customer_name=payload.customer_name,
        customer_email=str(payload.customer_email),
        currency=payload.currency,
        subtotal_usd=round(subtotal, 4),
        validity_date=payload.validity_date,
        line_items=[line.model_dump() for line in payload.line_items],
        notes=payload.notes,
        status=payload.status,
    )
    db.add(item)
    db.flush()
    audit(db, "create", "commercial_quotes", item.id, None, {"quote_number": item.quote_number, "subtotal_usd": item.subtotal_usd})
    if rfq.status == "new":
        rfq.status = "quoted"
    db.commit()
    db.refresh(item)
    return item


@router.patch("/quotes/{quote_id}", response_model=CommercialQuoteOut)
def update_commercial_quote(quote_id: str, payload: CommercialQuoteUpdate, db: Session = Depends(get_db)):
    item = db.get(CommercialQuote, quote_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commercial quote not found.")
    before = {"status": item.status, "subtotal_usd": item.subtotal_usd}
    data = payload.model_dump(exclude_unset=True, mode="json")
    if "line_items" in data and data["line_items"] is not None:
        item.subtotal_usd = round(sum(line["quantity"] * line["unit_price_usd"] for line in data["line_items"]), 4)
    for key, value in data.items():
        setattr(item, key, value)
    audit(db, "update", "commercial_quotes", item.id, before, data)
    db.commit()
    db.refresh(item)
    return item


@router.get("/audit-logs")
def list_audit_logs(limit: int = Query(default=200, ge=1, le=2000), db: Session = Depends(get_db)):
    logs = list(db.scalars(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit)).all())
    return [
        {
            "id": item.id,
            "actor": item.actor,
            "action": item.action,
            "target_table": item.target_table,
            "target_id": item.target_id,
            "before_json": item.before_json,
            "after_json": item.after_json,
            "created_at": item.created_at,
        }
        for item in logs
    ]


@router.post("/maintenance/recalculate-all", response_model=APIMessage)
def maintenance_recalculate(db: Session = Depends(get_db)):
    service = IndexCalculationService()
    values = service.recalculate_all_public(db)
    return APIMessage(message=f"Recalculated {len(values)} public indices.")
