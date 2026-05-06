from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Nexum Backend"
    environment: str = "development"
    database_url: str = "sqlite:///./nexum.db"
    auto_create_tables: bool = True
    admin_api_key: str = Field(default="change-me-to-a-long-random-secret")
    cors_origins: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8000",
            "https://nexumornn-9kbjwpyk.manus.space",
        ]
    )

    email_enabled: bool = False
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    smtp_use_tls: bool = True
    email_from: str = "no-reply@nexum.example"
    internal_alert_email: str | None = None

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value

def get_settings() -> Settings:
    return Settings()
