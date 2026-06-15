"""RUTAI API - punto de entrada de la aplicación FastAPI.

Este módulo solo crea la app, configura middleware (CORS) e incluye los routers.
Toda la lógica de negocio vive en services/, los datos en data/, los esquemas en
schemas/ y las rutas en routes/.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from routes import health, stations

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API backend de RUTAI - turismo inclusivo y accesible.",
)

# CORS para desarrollo. En producción se restringirán los orígenes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["root"])
def root() -> dict:
    """Punto de entrada informativo de la API (evita un 404 en la raíz)."""
    return {
        "service": settings.app_name,
        "status": "running",
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }


# Routers
app.include_router(health.router, prefix="/api")
app.include_router(stations.router, prefix="/api")
