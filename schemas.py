from __future__ import annotations

from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class APIMessage(BaseModel):
    message: str


class SiteNavItem(BaseModel):
    slug: str
    label: str
    href: str
    sort_order: int


class SiteConfigOut(BaseModel):
    brand: str
    tagline: str
    locales: list[str]
    navigation: list[SiteNavItem]
    cta: dict[str, str]


class OrganizationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: Literal["buyer", "supplier", "both", "internal"] = "buyer"
    country: str | None = None
    website: str | None = None
    description: str | None = None


class OrganizationOut(OrganizationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime


class ContactCreate(BaseModel):
    organization_id: str | None = None
    name: str = Field(default="Website Contact", min_length=1, max_length=255)
    email: EmailStr | None = None
    phone: str | None = None
    telegram: str | None = None
    whatsapp: str | None = None
    wechat: str | None = None
    role: str | None = None
    source: str | None = "website"


class ContactOut(ContactCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime


class ContactMessageCreate(BaseModel):
    email: EmailStr
    topic: str | None = Field(default=None, max_length=160)
    message: str = Field(min_length=1)


class ContactMessageOut(ContactMessageCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    created_at: datetime
    updated_at: datetime


class AccessRequestCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    company_name: str | None = Field(default=None, max_length=255)
    email: EmailStr
    role: str | None = Field(default=None, max_length=120)
    interest: str | None = Field(default=None, max_length=160)
    requested_product_slug: str | None = Field(default=None, max_length=120)
    message: str | None = None


class AccessRequestOut(AccessRequestCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    created_at: datetime
    updated_at: datetime


class PageContentCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=120)
    locale: str = Field(default="en", max_length=12)
    nav_label: str = Field(min_length=1, max_length=120)
    title: str = Field(min_length=1, max_length=255)
    subtitle: str | None = None
    hero_kicker: str | None = None
    body_json: dict[str, Any] = Field(default_factory=dict)
    seo_json: dict[str, Any] | None = None
    sort_order: int = 100
    is_nav_visible: bool = True
    is_published: bool = True


class PageContentUpdate(BaseModel):
    nav_label: str | None = None
    title: str | None = None
    subtitle: str | None = None
    hero_kicker: str | None = None
    body_json: dict[str, Any] | None = None
    seo_json: dict[str, Any] | None = None
    sort_order: int | None = None
    is_nav_visible: bool | None = None
    is_published: bool | None = None


class PageContentOut(PageContentCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class ProductDefinitionCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=120)
    name: str = Field(min_length=1, max_length=255)
    short_name: str | None = None
    summary: str | None = None
    status: Literal["available", "indicative", "custom", "draft"] = "available"
    model_name: str | None = None
    context_window: str | None = None
    service_class: str | None = None
    delivery_window: str | None = None
    included_input_tokens: int | None = Field(default=None, ge=0)
    included_output_tokens: int | None = Field(default=None, ge=0)
    settlement_currency: str = "USD"
    region: str | None = None
    delivery_format: str | None = None
    indicative_reference_price_usd: float | None = Field(default=None, ge=0)
    specs_json: dict[str, Any] | None = None
    exclusions_json: list[Any] | None = None
    use_cases_json: list[Any] | None = None
    ordering_steps_json: list[Any] | None = None
    faq_json: list[Any] | None = None
    is_featured: bool = False
    is_public: bool = True


class ProductDefinitionUpdate(BaseModel):
    name: str | None = None
    short_name: str | None = None
    summary: str | None = None
    status: Literal["available", "indicative", "custom", "draft"] | None = None
    model_name: str | None = None
    context_window: str | None = None
    service_class: str | None = None
    delivery_window: str | None = None
    included_input_tokens: int | None = Field(default=None, ge=0)
    included_output_tokens: int | None = Field(default=None, ge=0)
    settlement_currency: str | None = None
    region: str | None = None
    delivery_format: str | None = None
    indicative_reference_price_usd: float | None = Field(default=None, ge=0)
    specs_json: dict[str, Any] | None = None
    exclusions_json: list[Any] | None = None
    use_cases_json: list[Any] | None = None
    ordering_steps_json: list[Any] | None = None
    faq_json: list[Any] | None = None
    is_featured: bool | None = None
    is_public: bool | None = None


class ProductDefinitionOut(ProductDefinitionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class RFQCreate(BaseModel):
    request_type: Literal["token_package", "gpu_hour", "model_api", "custom"] = "custom"
    product_slug: str | None = None
    company_name: str | None = None
    contact_name: str = Field(min_length=1, max_length=255)
    contact_email: EmailStr
    contact_channel: str | None = Field(default=None, description="Telegram, WhatsApp, WeChat, phone, or other preferred channel")
    model_name: str | None = None
    input_tokens_per_month: int | None = Field(default=None, ge=0)
    output_tokens_per_month: int | None = Field(default=None, ge=0)
    package_quantity: int | None = Field(default=None, ge=1)
    gpu_type: str | None = None
    region: str | None = None
    latency_requirement: str | None = None
    budget_usd: float | None = Field(default=None, ge=0)
    delivery_deadline: date | None = None
    use_case: str | None = None
    notes: str | None = None


class RFQOut(RFQCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str | None = None
    contact_id: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime


class RFQStatusUpdate(BaseModel):
    status: Literal["new", "reviewing", "quoted", "won", "lost", "closed"]
    notes: str | None = None


class SupplierApplicationCreate(BaseModel):
    supplier_name: str = Field(min_length=1, max_length=255)
    contact_name: str = Field(min_length=1, max_length=255)
    contact_email: EmailStr
    contact_channel: str | None = None
    country: str | None = None
    website: str | None = None
    resource_type: Literal["gpu", "token", "api", "cloud", "other"]
    model_name: str | None = None
    gpu_type: str | None = None
    region: str | None = None
    unit: str = "USD/hour"
    price: float | None = Field(default=None, ge=0)
    currency: str = "USD"
    available_capacity: float | None = Field(default=None, ge=0)
    minimum_commitment: str | None = None
    valid_until: date | None = None
    notes: str | None = None


class SupplierQuoteCreate(BaseModel):
    supplier_org_id: str | None = None
    supplier_name: str | None = None
    resource_type: Literal["gpu", "token", "api", "cloud", "other"]
    model_name: str | None = None
    gpu_type: str | None = None
    region: str | None = None
    unit: str
    price: float = Field(ge=0)
    currency: str = "USD"
    minimum_commitment: str | None = None
    available_capacity: float | None = Field(default=None, ge=0)
    valid_until: date | None = None
    source_type: Literal["manual", "api", "scraped", "partner", "indicative", "executable"] = "manual"
    confidence_score: float = Field(default=0.6, ge=0, le=1)


class SupplierQuoteOut(SupplierQuoteCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime


class SupplierQuoteUpdate(BaseModel):
    supplier_name: str | None = None
    resource_type: Literal["gpu", "token", "api", "cloud", "other"] | None = None
    model_name: str | None = None
    gpu_type: str | None = None
    region: str | None = None
    unit: str | None = None
    price: float | None = Field(default=None, ge=0)
    currency: str | None = None
    minimum_commitment: str | None = None
    available_capacity: float | None = Field(default=None, ge=0)
    valid_until: date | None = None
    source_type: Literal["manual", "api", "scraped", "partner", "indicative", "executable"] | None = None
    confidence_score: float | None = Field(default=None, ge=0, le=1)


class PriceObservationCreate(BaseModel):
    asset_type: Literal["gpu_hour", "input_token", "output_token", "api_call", "token_package", "other"]
    asset_name: str = Field(min_length=1, max_length=160)
    model_name: str | None = None
    gpu_type: str | None = None
    region: str | None = None
    unit: str = "USD"
    price_usd: float = Field(gt=0)
    source: str = Field(min_length=1, max_length=255)
    source_url: str | None = None
    sample_time: datetime | None = None
    volume_available: float | None = Field(default=None, ge=0)
    confidence_score: float = Field(default=0.6, ge=0, le=1)


class PriceObservationOut(PriceObservationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    sample_time: datetime
    created_at: datetime


class PriceObservationUpdate(BaseModel):
    asset_type: Literal["gpu_hour", "input_token", "output_token", "api_call", "token_package", "other"] | None = None
    asset_name: str | None = Field(default=None, min_length=1, max_length=160)
    model_name: str | None = None
    gpu_type: str | None = None
    region: str | None = None
    unit: str | None = None
    price_usd: float | None = Field(default=None, gt=0)
    source: str | None = Field(default=None, min_length=1, max_length=255)
    source_url: str | None = None
    sample_time: datetime | None = None
    volume_available: float | None = Field(default=None, ge=0)
    confidence_score: float | None = Field(default=None, ge=0, le=1)


class IndexDefinitionCreate(BaseModel):
    symbol: str = Field(min_length=1, max_length=80)
    name: str = Field(min_length=1, max_length=255)
    family: str | None = None
    description: str | None = None
    asset_type: str
    asset_filter: dict[str, Any] | None = Field(
        default=None,
        description="Optional filters against price_observations, e.g. {'gpu_type': 'H100', 'region': 'US'}.",
    )
    calculation_method: str = "source_weighted_median"
    methodology_version: str = "v0.1"
    unit: str | None = None
    is_public: bool = True


class IndexDefinitionOut(IndexDefinitionCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime


class IndexDefinitionUpdate(BaseModel):
    name: str | None = None
    family: str | None = None
    description: str | None = None
    asset_type: str | None = None
    asset_filter: dict[str, Any] | None = None
    calculation_method: str | None = None
    methodology_version: str | None = None
    unit: str | None = None
    is_public: bool | None = None


class IndexValueOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    index_id: str
    timestamp: datetime
    value_usd: float
    open: float | None = None
    high: float | None = None
    low: float | None = None
    close: float | None = None
    sample_count: int
    confidence_score: float
    created_at: datetime


class PublicIndexOut(BaseModel):
    symbol: str
    name: str
    family: str | None = None
    description: str | None = None
    methodology_version: str
    unit: str | None = None
    latest: IndexValueOut | None = None


class TokenPackageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = None
    model_group: str | None = None
    included_input_tokens: int | None = Field(default=None, ge=0)
    included_output_tokens: int | None = Field(default=None, ge=0)
    price_usd: float | None = Field(default=None, ge=0)
    validity_days: int | None = Field(default=None, ge=0)
    sla_level: str | None = None
    is_public: bool = True


class TokenPackageUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    model_group: str | None = None
    included_input_tokens: int | None = Field(default=None, ge=0)
    included_output_tokens: int | None = Field(default=None, ge=0)
    price_usd: float | None = Field(default=None, ge=0)
    validity_days: int | None = Field(default=None, ge=0)
    sla_level: str | None = None
    is_public: bool | None = None


class TokenPackageOut(TokenPackageCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class MethodologyCreate(BaseModel):
    version: str = Field(min_length=1, max_length=80)
    title: str = Field(min_length=1, max_length=255)
    content_markdown: str = Field(min_length=1)
    effective_date: date | None = None
    status: Literal["draft", "active", "archived"] = "draft"


class MethodologyOut(MethodologyCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    effective_date: date
    created_at: datetime


class MethodologyUpdate(BaseModel):
    title: str | None = None
    content_markdown: str | None = None
    effective_date: date | None = None
    status: Literal["draft", "active", "archived"] | None = None


class DocsArticleCreate(BaseModel):
    slug: str = Field(min_length=1, max_length=160)
    title: str = Field(min_length=1, max_length=255)
    category: str = "general"
    summary: str | None = None
    content_markdown: str = Field(min_length=1)
    sort_order: int = 100
    is_public: bool = True


class DocsArticleUpdate(BaseModel):
    title: str | None = None
    category: str | None = None
    summary: str | None = None
    content_markdown: str | None = None
    sort_order: int | None = None
    is_public: bool | None = None


class DocsArticleOut(DocsArticleCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime


class CommercialQuoteLineItem(BaseModel):
    description: str
    quantity: float = Field(ge=0)
    unit: str
    unit_price_usd: float = Field(ge=0)


class CommercialQuoteCreate(BaseModel):
    customer_name: str = Field(min_length=1, max_length=255)
    customer_email: EmailStr
    currency: str = "USD"
    validity_date: date | None = None
    line_items: list[CommercialQuoteLineItem] = Field(default_factory=list)
    notes: str | None = None
    status: Literal["draft", "sent", "accepted", "rejected", "expired"] = "draft"


class CommercialQuoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    rfq_id: str | None = None
    quote_number: str
    customer_name: str
    customer_email: str
    currency: str
    subtotal_usd: float
    validity_date: date | None = None
    line_items: list[dict[str, Any]] | None = None
    notes: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime


class CommercialQuoteUpdate(BaseModel):
    customer_name: str | None = None
    customer_email: EmailStr | None = None
    currency: str | None = None
    validity_date: date | None = None
    line_items: list[CommercialQuoteLineItem] | None = None
    notes: str | None = None
    status: Literal["draft", "sent", "accepted", "rejected", "expired"] | None = None


class DashboardSummaryOut(BaseModel):
    rfq_count: int
    new_rfq_count: int
    access_request_count: int
    contact_message_count: int
    supplier_quote_count: int
    price_observation_count: int
    public_index_count: int
    public_product_count: int
