"""Configuración central de RUTAI API.

Lee variables de entorno (vía python-dotenv) y expone un objeto `settings`
reutilizable. Preparado para añadir credenciales de Supabase en sprints futuros.
"""

import os

from dotenv import load_dotenv

# Carga las variables definidas en un archivo .env si existe.
load_dotenv()


class Settings:
    """Configuración de la aplicación leída desde el entorno."""

    def __init__(self) -> None:
        self.app_name: str = os.getenv("APP_NAME", "RUTAI API")
        self.app_version: str = os.getenv("APP_VERSION", "0.1.0")
        self.environment: str = os.getenv("ENVIRONMENT", "development")

        # Orígenes permitidos para CORS. Separados por coma en la variable de entorno.
        cors_raw = os.getenv("CORS_ORIGINS", "*")
        if cors_raw.strip() == "*":
            self.cors_origins: list[str] = ["*"]
        else:
            self.cors_origins = [origin.strip() for origin in cors_raw.split(",") if origin.strip()]

        # Preparado para Supabase en sprints futuros (aún no se usa).
        self.supabase_url: str | None = os.getenv("SUPABASE_URL")
        self.supabase_key: str | None = os.getenv("SUPABASE_KEY")


settings = Settings()
