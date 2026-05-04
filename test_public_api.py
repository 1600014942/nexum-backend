from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app
from scripts.seed import main as seed_main


def setup_module():
    Base.metadata.drop_all(bind=engine)
    seed_main()


def test_core_public_pages_and_routes():
    client = TestClient(app)
    for path in [
        "/api/health",
        "/api/site/config",
        "/api/pages/home",
        "/api/pages/product",
        "/api/pages/indices",
        "/api/pages/markets",
        "/api/pages/methodology",
        "/api/pages/docs",
        "/api/pages/contact",
        "/api/products/featured",
        "/api/indices",
        "/api/methodology/latest",
        "/api/docs",
        "/product",
        "/indices",
        "/markets",
        "/methodology",
        "/docs",
        "/contact",
        "/access",
        "/quote",
    ]:
        response = client.get(path)
        assert response.status_code == 200, path


def test_forms_create_records():
    client = TestClient(app)
    rfq = client.post(
        "/api/rfq",
        json={"request_type": "token_package", "contact_name": "Test", "contact_email": "test@example.com", "package_quantity": 1},
    )
    assert rfq.status_code == 201
    assert rfq.json()["status"] == "new"

    contact = client.post("/api/contact", json={"email": "test@example.com", "topic": "Pricing", "message": "Hello"})
    assert contact.status_code == 201

    access = client.post("/api/access-requests", json={"name": "Test", "email": "test@example.com"})
    assert access.status_code == 201
