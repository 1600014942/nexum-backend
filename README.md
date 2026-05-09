# Nexum Backend v0.3 [This is the newest version]

A complete FastAPI backend for the Nexum public site and early commercial workflow.

This version supports the current public page structure:

- Home
- Product
- Product detail
- Indices
- Markets
- Methodology
- Docs
- Docs article detail
- Contact
- Request Access
- Request Quote
- Supplier application

It also includes a lightweight local preview frontend, so the backend can render working pages before you connect the Manus frontend.

## 1. Run locally

```bash
cd nexum_backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python scripts/seed.py
uvicorn app.main:app --reload --port 8000
```

Open:

```text
http://localhost:8000
http://localhost:8000/_docs
```

## 2. Working website routes

```text
/
/product
/product/qwen-standard-token-package-next-month
/indices
/markets
/methodology
/docs
/docs/quickstart
/contact
/access
/request-access
/quote
/request-quote
/supplier
```

## 3. Key public APIs

```text
GET  /api/site/config
GET  /api/site/map
GET  /api/pages/{slug}
GET  /api/pages/{slug}/bundle
GET  /api/products
GET  /api/products/featured
GET  /api/products/{slug}
GET  /api/indices
GET  /api/indices/{symbol}
GET  /api/indices/{symbol}/history
GET  /api/markets
GET  /api/methodology/latest
GET  /api/docs
GET  /api/docs/{slug}
POST /api/rfq
POST /api/request-quote
POST /api/access-requests
POST /api/request-access
POST /api/contact
POST /api/supplier/apply
```

## 4. Admin API

Admin endpoints require:

```text
X-Admin-Token: change-me-to-a-long-random-secret
```

Change this in `.env` before deployment.

Examples:

```text
GET  /api/admin/dashboard
GET  /api/admin/rfqs
PATCH /api/admin/rfqs/{rfq_id}/status
POST /api/admin/rfqs/{rfq_id}/quotes
GET  /api/admin/price-observations
POST /api/admin/price-observations
POST /api/admin/price-observations/import
POST /api/admin/indices/recalculate-all
GET  /api/admin/audit-logs
```

See `BACKEND_COVERAGE.md` for a full coverage matrix.

## 5. Environment

`.env.example` contains all required settings.

```text
DATABASE_URL=sqlite:///./nexum.db
ADMIN_API_KEY=change-me-to-a-long-random-secret
EMAIL_ENABLED=false
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:8000,https://nexumornn-9kbjwpyk.manus.space
```

For production, use PostgreSQL:

```text
DATABASE_URL=postgresql+psycopg2://USER:PASSWORD@HOST:5432/DBNAME
```

## 6. Tests

```bash
python -m pytest -q
```

Packaging status: `6 passed`.

## 7. What this backend is for

This is not yet a trading venue or settlement engine. It is the correct first-stage backend for Nexum:

1. Collect buyer RFQs.
2. Collect access requests.
3. Collect supplier-side supply and quote data.
4. Maintain product definitions and token packages.
5. Store price observations.
6. Calculate reference indices.
7. Publish docs and methodology.
8. Support a quote desk and audit log.

The commercial asset is the data trail: buyer demand, supplier supply, price observations, quotes, and index history.
