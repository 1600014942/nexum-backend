from __future__ import annotations

import logging
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api import admin, health, public
from app.config import get_settings
from app.database import Base, engine

# Import models so SQLAlchemy registers all tables before create_all.
from app import models  # noqa: F401

logging.basicConfig(level=logging.INFO)

settings = get_settings()
ROOT = Path(__file__).resolve().parents[1]
WEB_DIR = ROOT / "web"

app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Nexum backend for complete public-page data, RFQ intake, access requests, supplier onboarding, docs, product definitions, price observations, quote desk, and compute price indices.",
    docs_url="/_docs",
    redoc_url="/_redoc",
    openapi_url="/api/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)


app.include_router(health.router)
app.include_router(public.router)
app.include_router(admin.router)

if (WEB_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(WEB_DIR / "assets")), name="assets")


@app.get("/", include_in_schema=False)
def serve_home():
    index = WEB_DIR / "index.html"
    if index.exists():
        return FileResponse(index)
    return {"message": "Nexum backend is running. Open /docs for API documentation."}


@app.get("/{path:path}", include_in_schema=False)
def serve_spa(path: str):
    # Keep API 404s clear; all website routes are handled by the lightweight preview frontend.
    if path.startswith("api/"):
        return {"detail": "Not Found"}
    index = WEB_DIR / "index.html"
    if index.exists():
        return FileResponse(index)
    return {"message": "Nexum backend is running. Open /docs for API documentation."}
