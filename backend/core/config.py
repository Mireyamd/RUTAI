"""Central configuration for RUTAI API.

The app keeps working with mocks when database or Supabase variables are absent.
Database settings are exposed now only to prepare the next migration step.
"""

import os

from dotenv import load_dotenv

# Load variables from .env when the file exists.
load_dotenv()


class Settings:
    """Application settings read from environment variables."""

    def __init__(self) -> None:
        self.app_name: str = os.getenv("APP_NAME", "RUTAI API")
        self.app_version: str = os.getenv("APP_VERSION", "0.1.0")
        self.app_env: str = os.getenv(
            "APP_ENV",
            os.getenv("ENVIRONMENT", "development"),
        )
        self.environment: str = self.app_env

        # CORS origins. Use "*" in local development or comma-separated origins.
        cors_raw = os.getenv("CORS_ORIGINS", "*")
        if cors_raw.strip() == "*":
            self.cors_origins: list[str] = ["*"]
        else:
            self.cors_origins = [
                origin.strip()
                for origin in cors_raw.split(",")
                if origin.strip()
            ]

        # Prepared for Supabase/PostgreSQL. These are not used by repositories yet.
        self.database_url: str | None = os.getenv("DATABASE_URL")
        self.supabase_url: str | None = os.getenv("SUPABASE_URL")
        self.supabase_service_role_key: str | None = os.getenv(
            "SUPABASE_SERVICE_ROLE_KEY"
        )
        self.supabase_anon_key: str | None = os.getenv("SUPABASE_ANON_KEY")

        # Legacy placeholder kept for compatibility with existing local .env files.
        self.supabase_key: str | None = os.getenv("SUPABASE_KEY")


settings = Settings()
