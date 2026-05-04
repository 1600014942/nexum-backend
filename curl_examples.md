# cURL Examples

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/site/config
curl http://localhost:8000/api/pages/home
curl http://localhost:8000/api/products/featured
curl http://localhost:8000/api/indices
curl http://localhost:8000/api/methodology/latest
curl http://localhost:8000/api/docs
```

Submit RFQ:

```bash
curl -X POST http://localhost:8000/api/rfq \
  -H 'Content-Type: application/json' \
  -d '{
    "request_type":"token_package",
    "product_slug":"qwen-standard-token-package-next-month",
    "contact_name":"Jane Doe",
    "contact_email":"jane@example.com",
    "package_quantity":1,
    "model_name":"Qwen3.5-32B",
    "region":"Global"
  }'
```

Submit contact message:

```bash
curl -X POST http://localhost:8000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"email":"jane@example.com","topic":"Pricing","message":"Please contact me."}'
```

Submit access request:

```bash
curl -X POST http://localhost:8000/api/access-requests \
  -H 'Content-Type: application/json' \
  -d '{"name":"Jane Doe","company_name":"Example AI Company","email":"jane@example.com","interest":"Product Access"}'
```

Admin dashboard:

```bash
curl http://localhost:8000/api/admin/dashboard \
  -H 'X-Admin-Token: change-me-to-a-long-random-secret'
```

Create price observation:

```bash
curl -X POST http://localhost:8000/api/admin/price-observations \
  -H 'Content-Type: application/json' \
  -H 'X-Admin-Token: change-me-to-a-long-random-secret' \
  -d '{
    "asset_type":"input_token",
    "asset_name":"Qwen input token",
    "model_name":"Qwen",
    "unit":"USD/1M input tokens",
    "price_usd":0.11,
    "source":"manual-quote",
    "volume_available":1000,
    "confidence_score":0.7
  }'
```

Recalculate indices:

```bash
curl -X POST http://localhost:8000/api/admin/indices/recalculate-all \
  -H 'X-Admin-Token: change-me-to-a-long-random-secret'
```
