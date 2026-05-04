from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from sqlalchemy import select  # noqa: E402

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models import (  # noqa: E402
    DocsArticle,
    IndexDefinition,
    MethodologyVersion,
    PageContent,
    PriceObservation,
    ProductDefinition,
    TokenPackage,
)
from app.services.index_service import IndexCalculationService  # noqa: E402


def upsert_by(db, model, lookup: dict, values: dict):
    item = db.scalar(select(model).filter_by(**lookup))
    if item:
        for key, value in values.items():
            setattr(item, key, value)
        return item, False
    item = model(**lookup, **values)
    db.add(item)
    return item, True


def seed_pages(db) -> None:
    pages = [
        {
            "slug": "home",
            "locale": "en",
            "nav_label": "Home",
            "title": "The Pricing Layer for the AI Compute Economy",
            "subtitle": "Standardized pricing objects, reference indices, and structured markets for model usage and compute demand.",
            "hero_kicker": "MARKET INFRASTRUCTURE FOR AI COMPUTE ECONOMY",
            "sort_order": 0,
            "is_nav_visible": False,
            "body_json": {
                "hero_ctas": [
                    {"label": "Explore Products", "href": "/product"},
                    {"label": "View Indices", "href": "/indices"},
                ],
                "featured_package": {
                    "label": "Featured Package",
                    "name": "Qwen3.5-32B / 128k / Standard / Next-Month Token Package",
                    "detail": "100M input tokens · 20M output tokens · USD settlement",
                    "product_slug": "qwen-standard-token-package-next-month",
                },
                "signal_cards": [
                    {"type": "Index", "title": "Open Model Input Price Index", "description": "Reference pricing across model, window, and service class."},
                    {"type": "Index", "title": "Open Model Output Price Index", "description": "Standardized output-side reference layer for market comparison."},
                    {"type": "Market Signal", "title": "Forward Token Curve", "description": "Indicative pricing across future delivery windows."},
                ],
                "market_gap": {
                    "title": "A fast-growing market without a pricing layer",
                    "description": "Open-model usage has scale. What it still lacks is a standardized way to price future demand, compare supply, and structure forward exposure.",
                    "columns": [
                        {"title": "Buyers", "description": "Need forward visibility on token costs, usage planning, and pricing assumptions."},
                        {"title": "Providers", "description": "Need clearer reference prices, better capacity discipline, and more structured ways to monetize supply."},
                        {"title": "Markets", "description": "Need standardized objects that can support quoting, comparison, and future contract design."},
                    ],
                },
                "product_stack": [
                    {"number": "01", "title": "Reference Prices", "description": "Standardized pricing objects across model, context window, service class, and delivery structure."},
                    {"number": "02", "title": "Token Packages", "description": "Defined usage units that can be quoted, compared, reserved, and delivered."},
                    {"number": "03", "title": "Structured Markets", "description": "Forward-looking instruments built on top of token-based reference layers."},
                ],
                "built_for": [
                    {"title": "Model Providers", "description": "Monetize future capacity with clearer pricing objects and quoteable package structures."},
                    {"title": "AI Product Teams", "description": "Plan forward usage with more predictable pricing and delivery assumptions."},
                    {"title": "Brokers and Structured Desks", "description": "Work with standardized objects instead of fragmented, one-off quoting logic."},
                    {"title": "Market Makers and Pricing Participants", "description": "Engage around transparent reference layers and structured exposure."},
                ],
                "access": {"title": "Access the emerging market for token-based AI usage", "description": "Explore reference indices, standardized token packages, and structured market objects for the open model economy."},
            },
        },
        {
            "slug": "product",
            "locale": "en",
            "nav_label": "Product",
            "title": "Qwen Standard Token Package — Next Month",
            "subtitle": "Standardized forward usage package for model demand. Built around defined package size, delivery window, and API-based settlement.",
            "hero_kicker": "Standardized usage unit · Forward delivery window · API-based settlement",
            "sort_order": 10,
            "body_json": {
                "overview": "Qwen Standard Token Package — Next Month is a standardized usage product designed for teams that want clearer visibility on future model consumption. Instead of fragmented pay-as-you-go API usage, this package defines a fixed model, fixed service class, fixed delivery window, and fixed token structure.",
                "product_slug": "qwen-standard-token-package-next-month",
                "summary_card": {"indicative_reference_price": "$X,XXX", "cta": "Request Quote"},
                "pricing": [
                    {"title": "Indicative Reference Price", "description": "Reference pricing is based on standardized model pricing inputs and package structure."},
                    {"title": "Package Quote", "description": "Final package quotes reflect delivery window, package size, service class, and settlement conditions."},
                    {"title": "Settlement", "description": "Packages are settled as prepaid usage products and delivered as account-linked API balance."},
                    {"title": "Overage Policy", "description": "Usage beyond package balance is billed separately under applicable terms."},
                ],
            },
        },
        {
            "slug": "indices",
            "locale": "en",
            "nav_label": "Indices",
            "title": "Indices",
            "subtitle": "Reference layers for pricing, comparison, and market structure across model usage and compute demand.",
            "hero_kicker": None,
            "sort_order": 20,
            "body_json": {
                "intro": "Nexum's index family is designed to make fragmented model usage and compute demand legible as standardized market objects.",
                "index_family": [
                    {"title": "Open Model Input Price Index", "symbol": "NEX-OM-IN", "description": "Reference pricing for input-side usage across selected models and service classes."},
                    {"title": "Open Model Output Price Index", "symbol": "NEX-OM-OUT", "description": "Standardized pricing layer for output-side model usage."},
                    {"title": "Standard Token Package Index", "symbol": "NEX-STP", "description": "A packaged reference object for standardized delivery-based usage."},
                    {"title": "Forward Token Curve", "symbol": "NEX-FTC-30D", "description": "Indicative pricing across future token delivery windows."},
                    {"title": "Provider Reference Basket", "symbol": "NEX-PRB", "description": "Comparative reference layer across providers, routing paths, and quote classes."},
                    {"title": "Structured Volatility Surface", "symbol": "NEX-SVS", "description": "A future-facing framework for option-style token products."},
                ],
                "why_indices_matter": [
                    {"number": "1", "title": "Comparison", "description": "Make package and provider pricing comparable across standardized objects."},
                    {"number": "2", "title": "Quoting", "description": "Support structured package pricing and forward usage quoting."},
                    {"number": "3", "title": "Market Structure", "description": "Provide the reference layer from which broader market products can emerge."},
                ],
            },
        },
        {
            "slug": "markets",
            "locale": "en",
            "nav_label": "Markets",
            "title": "Markets",
            "subtitle": "Structured market layers built on standardized token demand and reference pricing.",
            "hero_kicker": None,
            "sort_order": 30,
            "body_json": {
                "intro": "Nexum turns model usage and compute demand into quoteable, comparable, and future-facing market objects.",
                "market_stack": [
                    {"number": "1", "title": "Reference Layer", "description": "Standardized pricing objects and comparable bases."},
                    {"number": "2", "title": "Quote Layer", "description": "Defined token packages and forward delivery structures."},
                    {"number": "3", "title": "Market Layer", "description": "Structured products built on top of standardized usage objects."},
                ],
                "market_objects": [
                    {"title": "Forward Token Packages", "description": "Token usage with defined delivery windows and settlement terms."},
                    {"title": "Option-Style Token Products", "description": "Flexible token usage rights with defined exercise windows and pricing."},
                    {"title": "Structured Usage Agreements", "description": "Customized token packages with tiered pricing and delivery flexibility."},
                    {"title": "Provider-Side Market Objects", "description": "Capacity and pricing instruments for model providers and compute suppliers."},
                ],
                "participants": [
                    {"title": "Providers", "description": "Model providers and compute suppliers offering standardized capacity."},
                    {"title": "Buyers", "description": "Teams and organizations sourcing token usage and compute capacity."},
                    {"title": "Brokers and Structured Desks", "description": "Intermediaries structuring and routing token packages and market products."},
                    {"title": "Market Makers and Pricing Participants", "description": "Participants providing liquidity and pricing reference across market layers."},
                ],
            },
        },
        {
            "slug": "methodology",
            "locale": "en",
            "nav_label": "Methodology",
            "title": "Methodology",
            "subtitle": "How standardized token packages, reference prices, and market objects are defined across model usage and forward delivery structure.",
            "hero_kicker": None,
            "sort_order": 40,
            "body_json": {
                "core_principles": [
                    {"title": "Standardize the object before pricing the market", "description": "A market cannot form around undefined usage."},
                    {"title": "Separate reference pricing from final quoting", "description": "Reference price anchors the object. Package quote reflects delivery and commercial terms."},
                    {"title": "Package usage, not raw infrastructure", "description": "The user-facing object is defined model usage rather than raw GPU time."},
                    {"title": "Build from comparable units", "description": "Objects must be comparable across packages, delivery windows, and service structures."},
                ],
                "object_dimensions": ["Model", "Context Window", "Service Class", "Delivery Window", "Package Structure", "Settlement Terms"],
                "scope_boundaries": ["multimodal inputs", "tool calls", "dedicated deployments", "premium latency guarantees", "third-party external usage fees"],
            },
        },
        {
            "slug": "docs",
            "locale": "en",
            "nav_label": "Docs",
            "title": "Docs",
            "subtitle": "Technical and commercial documentation for Nexum pricing objects, indices, RFQ workflows, and API access.",
            "hero_kicker": None,
            "sort_order": 50,
            "body_json": {
                "categories": ["Quickstart", "API", "Methodology", "Operations"],
                "cta": "Use Docs when integrating Nexum data into a frontend, internal dashboard, or quote workflow.",
            },
        },
        {
            "slug": "contact",
            "locale": "en",
            "nav_label": "Contact",
            "title": "Contact",
            "subtitle": "Questions, requests, partnerships, or product access — get in touch.",
            "hero_kicker": None,
            "sort_order": 60,
            "body_json": {
                "intro": "Use this form to reach the team about products, pricing, market structure, access, or collaboration.",
                "topics": ["Product Access", "Pricing", "Token Packages", "Indices", "Markets", "Partnerships", "Integration", "General Inquiry"],
                "next_steps": [
                    {"number": "1", "title": "Your message is reviewed", "description": "We read and understand your request."},
                    {"number": "2", "title": "We route it appropriately", "description": "Your message reaches the right team."},
                    {"number": "3", "title": "We follow up by email", "description": "We respond directly to your inquiry."},
                ],
            },
        },
        {
            "slug": "access",
            "locale": "en",
            "nav_label": "Request Access",
            "title": "Request Access",
            "subtitle": "Request access to Nexum product data, indices, quote flows, or API documentation.",
            "hero_kicker": "Access",
            "sort_order": 90,
            "is_nav_visible": False,
            "body_json": {
                "form_type": "access_request",
                "description": "Use this flow when you want product access rather than a specific package quote.",
                "interests": ["Product Access", "Pricing", "Indices", "Markets", "API Integration"],
            },
        },
        {
            "slug": "quote",
            "locale": "en",
            "nav_label": "Request Quote",
            "title": "Request a Quote",
            "subtitle": "Submit package, model API, or compute demand. This creates a real RFQ record in the backend.",
            "hero_kicker": "RFQ",
            "sort_order": 91,
            "is_nav_visible": False,
            "body_json": {
                "form_type": "rfq",
                "request_types": ["token_package", "gpu_hour", "model_api", "custom"],
                "description": "Use this flow for package pricing, delivery windows, and structured usage requests.",
            },
        },
    ]

    # Lightweight localized shells for the language toggle. These keep every page
    # addressable in Chinese and Korean while preserving the English body copy as
    # the canonical source during the MVP stage.
    localized_shells = {
        "zh": {
            "home": ("首页", "AI 算力经济的定价层", "将碎片化的模型使用与算力需求转化为可报价、可比较、可交易的市场对象。"),
            "product": ("产品", "Qwen 标准 Token 套餐 — 下月交付", "围绕固定模型、固定服务等级、固定交付窗口和固定 token 结构设计的标准化用量产品。"),
            "indices": ("指数", "指数", "用于模型使用和算力需求的定价、比较与市场结构参考层。"),
            "markets": ("市场", "Markets", "从标准化价格对象进入报价、比较和结构化市场。"),
            "methodology": ("方法论", "Methodology", "Nexum 的方法论从定义清晰的市场对象开始。"),
            "docs": ("文档", "Docs", "Nexum 定价对象、指数、RFQ 流程与 API 接入文档。"),
            "contact": ("联系", "Contact", "问题、请求、合作或产品访问，请联系团队。"),
            "access": ("申请访问", "Request Access", "申请访问 Nexum 产品数据、指数、报价流程或 API 文档。"),
            "quote": ("询价", "Request a Quote", "提交套餐、模型 API 或算力需求，并在后端生成 RFQ 记录。"),
        },
        "ko": {
            "home": ("Home", "AI Compute Economy Pricing Layer", "Fragmented model usage and compute demand become quoteable, comparable market objects."),
            "product": ("Product", "Qwen Standard Token Package — Next Month", "A standardized usage product built around fixed model, service class, delivery window, and token structure."),
            "indices": ("Indices", "Indices", "Reference layers for pricing, comparison, and market structure across model usage and compute demand."),
            "markets": ("Markets", "Markets", "From standardized price objects to quoting, comparison, and structured markets."),
            "methodology": ("Methodology", "Methodology", "Nexum methodology begins with clearly defined market objects."),
            "docs": ("Docs", "Docs", "Documentation for pricing objects, indices, RFQ workflows, and API access."),
            "contact": ("Contact", "Contact", "Questions, requests, partnerships, or product access — get in touch."),
            "access": ("Request Access", "Request Access", "Request access to Nexum product data, indices, quote flows, or API documentation."),
            "quote": ("Request Quote", "Request a Quote", "Submit package, model API, or compute demand and create a backend RFQ record."),
        },
    }
    en_by_slug = {page["slug"]: page for page in pages if page["locale"] == "en"}
    for locale, rows in localized_shells.items():
        for slug, (nav_label, title, subtitle) in rows.items():
            base = dict(en_by_slug[slug])
            base.update({"locale": locale, "nav_label": nav_label, "title": title, "subtitle": subtitle})
            pages.append(base)

    for page in pages:
        lookup = {"slug": page.pop("slug"), "locale": page.pop("locale")}
        upsert_by(db, PageContent, lookup, page)


def seed_products(db) -> None:
    product = {
        "slug": "qwen-standard-token-package-next-month",
        "name": "Qwen Standard Token Package — Next Month",
        "short_name": "Qwen Standard Token Package",
        "summary": "A quoteable usage unit for planning, procurement, and structured pricing.",
        "status": "indicative",
        "model_name": "Qwen3.5-32B",
        "context_window": "128k",
        "service_class": "Standard",
        "delivery_window": "Next calendar month",
        "included_input_tokens": 100_000_000,
        "included_output_tokens": 20_000_000,
        "settlement_currency": "USD",
        "region": "Global / compatible routing",
        "delivery_format": "API usage balance",
        "indicative_reference_price_usd": None,
        "specs_json": {
            "Model": "Qwen3.5-32B",
            "Context Window": "128k",
            "Service Class": "Standard",
            "Delivery Window": "Next calendar month",
            "Included Input Tokens": "100M",
            "Included Output Tokens": "20M",
            "Settlement Currency": "USD",
            "Region": "Global / compatible routing",
            "Delivery Format": "API usage balance",
        },
        "exclusions_json": ["Tool calls", "Image inputs", "Video inputs", "Dedicated deployment", "Premium latency guarantees", "External search or retrieval fees"],
        "use_cases_json": [
            {"title": "Budget Planning", "description": "For teams that need forward visibility on model usage costs before the next delivery cycle."},
            {"title": "Procurement", "description": "For organizations that want a standardized package instead of fragmented API purchasing."},
            {"title": "Forward Usage Management", "description": "For operators who want clearer delivery structure and package-based planning."},
        ],
        "ordering_steps_json": [
            {"number": "1", "title": "Submit a request", "description": "Select package quantity and submit your usage requirements."},
            {"number": "2", "title": "Receive a quote", "description": "A package quote is issued against delivery window, package size, and service terms."},
            {"number": "3", "title": "Confirm and settle", "description": "Once confirmed, the package is provisioned for the specified delivery window."},
            {"number": "4", "title": "Access package balance", "description": "The account receives package-linked API balance and access credentials."},
        ],
        "faq_json": [
            {"question": "What exactly am I buying?", "answer": "A defined quantity of model usage under a specified service class and delivery window."},
            {"question": "How is this different from retail API usage?", "answer": "The package is quoted as a standardized forward usage object rather than open-ended pay-as-you-go usage."},
            {"question": "How is usage delivered?", "answer": "Usage is delivered as account-linked API balance and deducted during the delivery period."},
            {"question": "What happens if I exceed the package balance?", "answer": "Overage usage is billed separately under the applicable commercial terms."},
            {"question": "Does this include multimodal usage or tool calls?", "answer": "No. Standard packages exclude multimodal inputs, tool calls, dedicated deployment, and premium latency tiers unless separately quoted."},
        ],
        "is_featured": True,
        "is_public": True,
    }
    upsert_by(db, ProductDefinition, {"slug": product.pop("slug")}, product)

    legacy_packages = [
        TokenPackage(
            name="Standard Token Package — 30 Day Delivery Window",
            description="A quoteable usage unit for planning, procurement, and structured pricing.",
            model_group="Qwen3.5-32B",
            included_input_tokens=100_000_000,
            included_output_tokens=20_000_000,
            price_usd=None,
            validity_days=30,
            sla_level="standard",
            is_public=True,
        ),
        TokenPackage(
            name="Priority Token Package — Fixed Delivery Window",
            description="Built for demand that values predictable access and defined service class.",
            model_group="open-model-basket",
            included_input_tokens=500_000_000,
            included_output_tokens=100_000_000,
            price_usd=None,
            validity_days=30,
            sla_level="priority",
            is_public=True,
        ),
        TokenPackage(
            name="Custom Package Request",
            description="For providers, brokers, and structured desks working with defined supply and delivery terms.",
            model_group="custom",
            included_input_tokens=None,
            included_output_tokens=None,
            price_usd=None,
            validity_days=None,
            sla_level="custom",
            is_public=True,
        ),
    ]
    existing = {p.name for p in db.query(TokenPackage).all()}
    for package in legacy_packages:
        if package.name not in existing:
            db.add(package)


def seed_docs_and_methodology(db) -> None:
    methodology_md = """# Nexum Indicative Compute Price Index Methodology

Version v0.2 defines token packages and compute price indices as standardized market objects.

## Object definition
Each object is defined by model, context window, service class, delivery window, package size, settlement currency, and delivery format.

## Reference price
Reference price is not a final execution price. It is the base pricing layer from which package quotes are formed.

## Calculation
Public index values use a source-weighted median over valid observations in the most recent 72-hour lookback window. Each observation is weighted by available capacity and confidence score. Outliers are filtered when sample count is sufficient.

## Disclosure
Each index publishes sample count, methodology version, and confidence score. Indicative references should not be treated as executable quotes unless explicitly marked as executable.
"""
    upsert_by(
        db,
        MethodologyVersion,
        {"version": "v0.2"},
        {"title": "Nexum Standardized Token Package and Index Methodology", "status": "active", "effective_date": date.today(), "content_markdown": methodology_md},
    )
    old = db.scalar(select(MethodologyVersion).where(MethodologyVersion.version == "v0.1"))
    if old:
        old.status = "archived"

    docs = [
        {
            "slug": "quickstart",
            "title": "Quickstart",
            "category": "Quickstart",
            "summary": "How to connect a frontend to the Nexum backend.",
            "content_markdown": "# Quickstart\n\nRun the backend, seed demo data, then call `/api/site/config`, `/api/pages/home`, `/api/products/featured`, and `/api/indices` from your frontend.",
            "sort_order": 10,
            "is_public": True,
        },
        {
            "slug": "api-reference",
            "title": "API Reference",
            "category": "API",
            "summary": "Core public and admin endpoints.",
            "content_markdown": "# API Reference\n\nPublic endpoints: `/api/pages/{slug}`, `/api/products`, `/api/indices`, `/api/rfq`, `/api/contact`, `/api/access-requests`. Admin endpoints require `X-Admin-Token`.",
            "sort_order": 20,
            "is_public": True,
        },
        {
            "slug": "rfq-workflow",
            "title": "RFQ Workflow",
            "category": "Operations",
            "summary": "How buyer requests become quoteable commercial records.",
            "content_markdown": "# RFQ Workflow\n\nA buyer submits `/api/rfq`. The record appears in `/api/admin/rfqs`. The desk can update status and create commercial quotes linked to the RFQ.",
            "sort_order": 30,
            "is_public": True,
        },
        {
            "slug": "index-methodology",
            "title": "Index Methodology",
            "category": "Methodology",
            "summary": "How observations become public reference indices.",
            "content_markdown": methodology_md,
            "sort_order": 40,
            "is_public": True,
        },
    ]
    for doc in docs:
        lookup = {"slug": doc.pop("slug")}
        upsert_by(db, DocsArticle, lookup, doc)


def seed_indices_and_prices(db) -> None:
    definitions = [
        {"symbol": "NEX-OM-IN", "name": "Open Model Input Price Index", "family": "Token", "description": "Reference pricing for input-side usage across selected open models and service classes.", "asset_type": "input_token", "asset_filter": {"unit": "USD/1M input tokens"}, "unit": "USD/1M input tokens"},
        {"symbol": "NEX-OM-OUT", "name": "Open Model Output Price Index", "family": "Token", "description": "Reference pricing for output-side model usage.", "asset_type": "output_token", "asset_filter": {"unit": "USD/1M output tokens"}, "unit": "USD/1M output tokens"},
        {"symbol": "NEX-STP", "name": "Standard Token Package Index", "family": "Package", "description": "A packaged reference object for standardized delivery-based usage.", "asset_type": "token_package", "asset_filter": {"asset_name": "standard-token-package-30d"}, "unit": "USD/package"},
        {"symbol": "NEX-FTC-30D", "name": "Forward Token Curve — 30D", "family": "Forward", "description": "Indicative pricing for future token delivery windows.", "asset_type": "token_package", "asset_filter": {"asset_name": "forward-token-package-30d"}, "unit": "USD/package"},
        {"symbol": "NEX-PRB", "name": "Provider Reference Basket", "family": "Provider", "description": "Comparative reference layer across providers, routing paths, and quote classes.", "asset_type": "api_call", "asset_filter": {"asset_name": "provider-reference-basket"}, "unit": "USD/weighted unit"},
        {"symbol": "NEX-H100-US", "name": "Nexum H100 US GPU-hour Index", "family": "Compute", "description": "Indicative USD/hour benchmark for H100 supply in the US region.", "asset_type": "gpu_hour", "asset_filter": {"gpu_type": "H100", "region": "US"}, "unit": "USD/hour"},
        {"symbol": "NEX-QWEN-IN", "name": "Nexum Qwen Input Token Index", "family": "Token", "description": "Indicative USD per 1M input tokens for Qwen-family model access.", "asset_type": "input_token", "asset_filter": {"model_name": "Qwen"}, "unit": "USD/1M input tokens"},
        {"symbol": "NEX-QWEN-OUT", "name": "Nexum Qwen Output Token Index", "family": "Token", "description": "Indicative USD per 1M output tokens for Qwen-family model access.", "asset_type": "output_token", "asset_filter": {"model_name": "Qwen"}, "unit": "USD/1M output tokens"},
    ]
    for d in definitions:
        d.update({"calculation_method": "source_weighted_median", "methodology_version": "v0.2", "is_public": True})
        lookup = {"symbol": d.pop("symbol")}
        upsert_by(db, IndexDefinition, lookup, d)

    if db.query(PriceObservation).count() > 0:
        return

    now = datetime.now(timezone.utc)
    observations = [
        # GPU observations
        ("gpu_hour", "H100 on-demand GPU-hour", None, "H100", "US", "USD/hour", 2.30, "demo-supplier-a", 20, 0.70, 3),
        ("gpu_hour", "H100 reserved GPU-hour", None, "H100", "US", "USD/hour", 2.05, "demo-supplier-b", 60, 0.80, 6),
        ("gpu_hour", "H100 spot GPU-hour", None, "H100", "US", "USD/hour", 1.95, "demo-marketplace-c", 10, 0.55, 9),
        # Qwen + open-model token observations
        ("input_token", "Qwen input token", "Qwen", None, "Global", "USD/1M input tokens", 0.12, "demo-api-provider-a", 1000, 0.75, 2),
        ("input_token", "Qwen input token", "Qwen", None, "Global", "USD/1M input tokens", 0.10, "demo-api-provider-b", 500, 0.65, 5),
        ("input_token", "Open model input token", "Open Model Basket", None, "Global", "USD/1M input tokens", 0.14, "demo-router-a", 800, 0.60, 4),
        ("output_token", "Qwen output token", "Qwen", None, "Global", "USD/1M output tokens", 0.38, "demo-api-provider-a", 1000, 0.75, 2),
        ("output_token", "Qwen output token", "Qwen", None, "Global", "USD/1M output tokens", 0.32, "demo-api-provider-b", 500, 0.65, 5),
        ("output_token", "Open model output token", "Open Model Basket", None, "Global", "USD/1M output tokens", 0.42, "demo-router-a", 800, 0.60, 4),
        # Package/market observations
        ("token_package", "standard-token-package-30d", "Qwen", None, "Global", "USD/package", 19.5, "demo-quote-desk-a", 10, 0.65, 2),
        ("token_package", "standard-token-package-30d", "Qwen", None, "Global", "USD/package", 21.0, "demo-quote-desk-b", 8, 0.70, 8),
        ("token_package", "forward-token-package-30d", "Qwen", None, "Global", "USD/package", 22.5, "demo-forward-desk-a", 5, 0.55, 3),
        ("token_package", "forward-token-package-30d", "Qwen", None, "Global", "USD/package", 23.2, "demo-forward-desk-b", 4, 0.50, 7),
        ("api_call", "provider-reference-basket", "Open Model Basket", None, "Global", "USD/weighted unit", 1.00, "demo-provider-basket-a", 100, 0.60, 1),
        ("api_call", "provider-reference-basket", "Open Model Basket", None, "Global", "USD/weighted unit", 0.94, "demo-provider-basket-b", 100, 0.55, 6),
    ]
    for asset_type, asset_name, model_name, gpu_type, region, unit, price, source, volume, confidence, hours in observations:
        db.add(
            PriceObservation(
                asset_type=asset_type,
                asset_name=asset_name,
                model_name=model_name,
                gpu_type=gpu_type,
                region=region,
                unit=unit,
                price_usd=price,
                source=source,
                sample_time=now - timedelta(hours=hours),
                volume_available=volume,
                confidence_score=confidence,
            )
        )


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_pages(db)
        seed_products(db)
        seed_docs_and_methodology(db)
        seed_indices_and_prices(db)
        db.commit()

        service = IndexCalculationService()
        values = service.recalculate_all_public(db)
        print(f"Seed complete. Recalculated {len(values)} indices.")
        print("Preview site: http://localhost:8000")
        print("API docs: http://localhost:8000/_docs")
    finally:
        db.close()


if __name__ == "__main__":
    main()
