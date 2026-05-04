# Frontend Integration Contract

Use this file when connecting the Manus frontend to the backend.

## Base URL

Local:

```js
const API_BASE = "http://localhost:8000";
```

Production:

```js
const API_BASE = "https://your-backend-domain.com";
```

## Page data mapping

| Website route | API data |
|---|---|
| `/` | `GET /api/pages/home`, `GET /api/products/featured`, `GET /api/indices` |
| `/product` | `GET /api/pages/product`, `GET /api/products/featured` |
| `/indices` | `GET /api/pages/indices`, `GET /api/indices` |
| `/markets` | `GET /api/pages/markets`, `GET /api/markets/objects` |
| `/methodology` | `GET /api/pages/methodology`, `GET /api/methodology/latest` |
| `/docs` | `GET /api/pages/docs`, `GET /api/docs` |
| `/contact` | `GET /api/pages/contact`, `POST /api/contact` |
| Request Access button | `POST /api/access-requests` |
| Request Quote button | `POST /api/rfq` |

## RFQ payload

```json
{
  "request_type": "token_package",
  "product_slug": "qwen-standard-token-package-next-month",
  "company_name": "Example AI Company",
  "contact_name": "Jane Doe",
  "contact_email": "jane@example.com",
  "contact_channel": "Telegram: @jane",
  "model_name": "Qwen3.5-32B",
  "package_quantity": 1,
  "input_tokens_per_month": 100000000,
  "output_tokens_per_month": 20000000,
  "region": "Global",
  "budget_usd": 1000,
  "use_case": "Production inference workload",
  "notes": "Need next-month delivery window."
}
```

## Contact payload

```json
{
  "email": "jane@example.com",
  "topic": "Pricing",
  "message": "We want to discuss token package pricing."
}
```

## Access request payload

```json
{
  "name": "Jane Doe",
  "company_name": "Example AI Company",
  "email": "jane@example.com",
  "role": "Founder",
  "interest": "Product Access",
  "requested_product_slug": "qwen-standard-token-package-next-month",
  "message": "Please grant access to product and index data."
}
```

