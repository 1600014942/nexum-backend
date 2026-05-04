from __future__ import annotations

import uuid
from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def new_uuid() -> str:
    return str(uuid.uuid4())


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(255), index=True)
    type: Mapped[str] = mapped_column(String(32), default="buyer")  # buyer/supplier/both/internal
    country: Mapped[str | None] = mapped_column(String(120), nullable=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    contacts: Mapped[list[Contact]] = relationship(back_populates="organization", cascade="all, delete-orphan")


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    organization_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str | None] = mapped_column(String(255), index=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(80), nullable=True)
    telegram: Mapped[str | None] = mapped_column(String(120), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(120), nullable=True)
    wechat: Mapped[str | None] = mapped_column(String(120), nullable=True)
    role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    source: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    organization: Mapped[Organization | None] = relationship(back_populates="contacts")


class PageContent(Base):
    """Page-level content API for the public website.

    The frontend can use this table to render the main page and every subpage without
    hard-coding copy or cards. body_json stores sections/cards/CTA/FAQ in a flexible
    format, which is more practical than a rigid CMS schema at this stage.
    """

    __tablename__ = "page_contents"
    __table_args__ = (UniqueConstraint("slug", "locale", name="uq_page_slug_locale"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(120), index=True)
    locale: Mapped[str] = mapped_column(String(12), default="en", index=True)
    nav_label: Mapped[str] = mapped_column(String(120))
    title: Mapped[str] = mapped_column(String(255))
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    hero_kicker: Mapped[str | None] = mapped_column(String(255), nullable=True)
    body_json: Mapped[dict] = mapped_column(JSON, default=dict)
    seo_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    is_nav_visible: Mapped[bool] = mapped_column(Boolean, default=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class ProductDefinition(Base):
    __tablename__ = "product_definitions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    short_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(80), default="available")  # available/indicative/custom/draft
    model_name: Mapped[str | None] = mapped_column(String(160), nullable=True)
    context_window: Mapped[str | None] = mapped_column(String(80), nullable=True)
    service_class: Mapped[str | None] = mapped_column(String(80), nullable=True)
    delivery_window: Mapped[str | None] = mapped_column(String(160), nullable=True)
    included_input_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    included_output_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    settlement_currency: Mapped[str] = mapped_column(String(12), default="USD")
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)
    delivery_format: Mapped[str | None] = mapped_column(String(160), nullable=True)
    indicative_reference_price_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    specs_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    exclusions_json: Mapped[list | None] = mapped_column(JSON, nullable=True)
    use_cases_json: Mapped[list | None] = mapped_column(JSON, nullable=True)
    ordering_steps_json: Mapped[list | None] = mapped_column(JSON, nullable=True)
    faq_json: Mapped[list | None] = mapped_column(JSON, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class RFQRequest(Base):
    __tablename__ = "rfq_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    organization_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=True)
    contact_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("contacts.id"), nullable=True)

    request_type: Mapped[str] = mapped_column(String(80), default="custom")
    product_slug: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_name: Mapped[str] = mapped_column(String(255))
    contact_email: Mapped[str] = mapped_column(String(255), index=True)
    contact_channel: Mapped[str | None] = mapped_column(String(255), nullable=True)

    model_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    input_tokens_per_month: Mapped[int | None] = mapped_column(Integer, nullable=True)
    output_tokens_per_month: Mapped[int | None] = mapped_column(Integer, nullable=True)
    package_quantity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    gpu_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)
    latency_requirement: Mapped[str | None] = mapped_column(String(255), nullable=True)
    budget_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    delivery_deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    use_case: Mapped[str | None] = mapped_column(Text, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    status: Mapped[str] = mapped_column(String(32), default="new", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class AccessRequest(Base):
    __tablename__ = "access_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(255))
    company_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    interest: Mapped[str | None] = mapped_column(String(160), nullable=True)
    requested_product_slug: Mapped[str | None] = mapped_column(String(120), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="new", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    email: Mapped[str] = mapped_column(String(255), index=True)
    topic: Mapped[str | None] = mapped_column(String(160), nullable=True)
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="new", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class SupplierQuote(Base):
    __tablename__ = "supplier_quotes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    supplier_org_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("organizations.id"), nullable=True)
    supplier_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    resource_type: Mapped[str] = mapped_column(String(80))  # gpu/token/api/cloud/other
    model_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    gpu_type: Mapped[str | None] = mapped_column(String(120), nullable=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True)
    unit: Mapped[str] = mapped_column(String(80))
    price: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(12), default="USD")
    minimum_commitment: Mapped[str | None] = mapped_column(String(255), nullable=True)
    available_capacity: Mapped[float | None] = mapped_column(Float, nullable=True)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    source_type: Mapped[str] = mapped_column(String(80), default="manual")
    confidence_score: Mapped[float] = mapped_column(Float, default=0.6)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)


class PriceObservation(Base):
    __tablename__ = "price_observations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    asset_type: Mapped[str] = mapped_column(String(80), index=True)  # gpu_hour/input_token/output_token/api_call/token_package
    asset_name: Mapped[str] = mapped_column(String(160), index=True)
    model_name: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    gpu_type: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    region: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    unit: Mapped[str] = mapped_column(String(80), default="USD")
    price_usd: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(255))
    source_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    sample_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    volume_available: Mapped[float | None] = mapped_column(Float, nullable=True)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.6)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)


class IndexDefinition(Base):
    __tablename__ = "index_definitions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    symbol: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    family: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    asset_type: Mapped[str] = mapped_column(String(80), index=True)
    asset_filter: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    calculation_method: Mapped[str] = mapped_column(String(120), default="source_weighted_median")
    methodology_version: Mapped[str] = mapped_column(String(80), default="v0.1")
    unit: Mapped[str | None] = mapped_column(String(80), nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    values: Mapped[list[IndexValue]] = relationship(back_populates="index", cascade="all, delete-orphan")


class IndexValue(Base):
    __tablename__ = "index_values"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    index_id: Mapped[str] = mapped_column(String(36), ForeignKey("index_definitions.id"), index=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    value_usd: Mapped[float] = mapped_column(Float)
    open: Mapped[float | None] = mapped_column(Float, nullable=True)
    high: Mapped[float | None] = mapped_column(Float, nullable=True)
    low: Mapped[float | None] = mapped_column(Float, nullable=True)
    close: Mapped[float | None] = mapped_column(Float, nullable=True)
    sample_count: Mapped[int] = mapped_column(Integer, default=0)
    confidence_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    index: Mapped[IndexDefinition] = relationship(back_populates="values")


class TokenPackage(Base):
    __tablename__ = "token_packages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    model_group: Mapped[str | None] = mapped_column(String(160), nullable=True)
    included_input_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    included_output_tokens: Mapped[int | None] = mapped_column(Integer, nullable=True)
    price_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    validity_days: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sla_level: Mapped[str | None] = mapped_column(String(120), nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class MethodologyVersion(Base):
    __tablename__ = "methodology_versions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    version: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    content_markdown: Mapped[str] = mapped_column(Text)
    effective_date: Mapped[date] = mapped_column(Date, default=date.today)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)


class DocsArticle(Base):
    __tablename__ = "docs_articles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(120), default="general", index=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    content_markdown: Mapped[str] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class CommercialQuote(Base):
    __tablename__ = "commercial_quotes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    rfq_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("rfq_requests.id"), nullable=True, index=True)
    quote_number: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(255))
    customer_email: Mapped[str] = mapped_column(String(255), index=True)
    currency: Mapped[str] = mapped_column(String(12), default="USD")
    subtotal_usd: Mapped[float] = mapped_column(Float, default=0.0)
    validity_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    line_items: Mapped[list | None] = mapped_column(JSON, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="draft", index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    actor: Mapped[str | None] = mapped_column(String(120), nullable=True)
    action: Mapped[str] = mapped_column(String(120))
    target_table: Mapped[str] = mapped_column(String(120))
    target_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    before_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    after_json: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
