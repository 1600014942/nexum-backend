from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_public_page_and_data_routes_are_available():
    paths = [
        "/api/site/config",
        "/api/site/map",
        "/api/pages/home",
        "/api/pages/product",
        "/api/pages/indices",
        "/api/pages/markets",
        "/api/pages/methodology",
        "/api/pages/docs",
        "/api/pages/contact",
        "/api/pages/access",
        "/api/pages/quote",
        "/api/pages/home/bundle",
        "/api/pages/product/bundle",
        "/api/pages/indices/bundle",
        "/api/pages/markets/bundle",
        "/api/pages/methodology/bundle",
        "/api/pages/docs/bundle",
        "/api/products",
        "/api/products/featured",
        "/api/products/qwen-standard-token-package-next-month",
        "/api/indices",
        "/api/markets",
        "/api/markets/objects",
        "/api/methodology/latest",
        "/api/docs",
        "/api/docs/quickstart",
        "/api/form-options",
    ]
    for path in paths:
        response = client.get(path)
        assert response.status_code == 200, path


def test_public_forms_create_records():
    rfq_payload = {
        "request_type": "token_package",
        "contact_name": "Test Buyer",
        "contact_email": "buyer@example.com",
    }
    assert client.post("/api/rfq", json=rfq_payload).status_code == 201
    assert client.post("/api/request-quote", json=rfq_payload).status_code == 201

    access_payload = {"name": "Test User", "email": "access@example.com"}
    assert client.post("/api/access-requests", json=access_payload).status_code == 201
    assert client.post("/api/request-access", json=access_payload).status_code == 201

    contact_payload = {"email": "contact@example.com", "message": "Hello"}
    assert client.post("/api/contact", json=contact_payload).status_code == 201

    supplier_payload = {
        "supplier_name": "Supplier",
        "contact_name": "Operator",
        "contact_email": "supplier@example.com",
        "resource_type": "gpu",
        "unit": "USD/hour",
    }
    assert client.post("/api/supplier/apply", json=supplier_payload).status_code == 201
