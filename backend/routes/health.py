"""Router de salud (health check) de RUTAI API."""

from fastapi import APIRouter

from core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict:
    """Devuelve el estado del servicio."""
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }
