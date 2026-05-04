# Nexum Backend Coverage Matrix — v0.3

This backend is designed to support the current Nexum public site structure and a working local preview frontend.

## Public website routes

| Website route | Status | Backing API |
|---|---:|---|
| `/` | Covered | `/api/pages/home`, `/api/pages/home/bundle`, `/api/products/featured`, `/api/indices` |
| `/product` | Covered | `/api/pages/product`, `/api/products/featured` |
| `/product/{slug}` | Covered | `/api/products/{slug}` |
| `/indices` | Covered | `/api/pages/indices`, `/api/indices` |
| `/markets` | Covered | `/api/pages/markets`, `/api/markets`, `/api/markets/objects` |
| `/methodology` | Covered | `/api/pages/methodology`, `/api/methodology/latest` |
| `/docs` | Covered | `/api/pages/docs`, `/api/docs` |
| `/docs/{slug}` | Covered | `/api/docs/{slug}` |
| `/contact` | Covered | `/api/pages/contact`, `POST /api/contact` |
| `/access` | Covered | `/api/pages/access`, `POST /api/access-requests` |
| `/request-access` | Covered | Alias for `/access`, `POST /api/request-access` |
| `/quote` | Covered | `/api/pages/quote`, `POST /api/rfq` |
| `/request-quote` | Covered | Alias for `/quote`, `POST /api/request-quote` |
| `/supplier` | Covered | `POST /api/supplier/apply` |

## Public APIs

| Area | Endpoints |
|---|---|
| Site config | `GET /api/site/config`, `GET /api/site/map` |
| CMS pages | `GET /api/pages`, `GET /api/pages/{slug}`, `GET /api/pages/{slug}/bundle` |
| Products | `GET /api/products`, `GET /api/products/featured`, `GET /api/products/{slug}` |
| Indices | `GET /api/indices`, `GET /api/indices/{symbol}`, `GET /api/indices/{symbol}/history` |
| Markets | `GET /api/markets`, `GET /api/markets/objects` |
| Methodology | `GET /api/methodology/latest` |
| Docs | `GET /api/docs`, `GET /api/docs/{slug}` |
| Forms | `POST /api/rfq`, `POST /api/request-quote`, `POST /api/access-requests`, `POST /api/request-access`, `POST /api/contact`, `POST /api/supplier/apply` |

## Admin APIs

All admin endpoints require `X-Admin-Token`.

| Area | Endpoints |
|---|---|
| Dashboard | `GET /api/admin/dashboard` |
| CMS pages | list/create/update |
| Products | list/create/update |
| Docs | list/create/update |
| RFQs | list/update status/create quote |
| Access requests | list/update status |
| Contact messages | list/update status |
| Price observations | list/create/update/delete/bulk import |
| Supplier quotes | list/create/update/delete |
| Index definitions | list/create/update |
| Index calculation | recalculate one/recalculate all |
| Token packages | list/create/update |
| Methodologies | list/create/update |
| Commercial quotes | list/update |
| Audit logs | list |

## Implemented but still production-dependent

The backend includes hooks for email notifications, CORS, admin API key auth, SQLite/PostgreSQL, Docker, and seeded demo data. For production, you still need to configure:

1. A real PostgreSQL database URL.
2. A non-default admin API key.
3. SMTP or an email provider.
4. Your production frontend origin in `CORS_ORIGINS`.
5. Optional database migrations if schema changes continue after launch.

## Test status

The included test suite covers public page APIs, data APIs, form creation, index calculation, and admin auth. At packaging time: `6 passed`.
