"""Router de estaciones de RUTAI API.

Importante: la ruta `/by-code/{code}` se define ANTES de `/{station_id}` para
evitar que FastAPI interprete "by-code" como un station_id.
"""

from fastapi import APIRouter, HTTPException

from schemas.audio_schema import AudioGuideResponse
from schemas.safety_schema import SafetyPointResponse
from schemas.station_context_schema import StationContextResponse
from schemas.station_schema import StationResponse
from schemas.touch_schema import TouchResourceResponse
from services import audio_service, safety_service, station_service, touch_service

router = APIRouter(prefix="/stations", tags=["stations"])


@router.get("", response_model=list[StationResponse])
def list_stations() -> list[StationResponse]:
    """Lista todas las estaciones de la ruta RUTAI."""
    return station_service.get_all_stations()


@router.get("/by-code/{code}", response_model=StationResponse)
def get_station_by_code(code: str) -> StationResponse:
    """Obtiene una estación por su código público (ej. "001")."""
    station = station_service.get_station_by_code(code)
    if station is None:
        raise HTTPException(status_code=404, detail="Station code not found")
    return station


@router.get("/{station_id}/context", response_model=StationContextResponse)
def get_station_context(station_id: str) -> StationContextResponse:
    """Obtiene el contexto completo de una estación.

    Agrupa la estación con su audioguía, sus puntos de seguridad y su recurso
    táctil para alimentar la experiencia guiada de la PWA.
    """
    station = station_service.get_station_by_id(station_id)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")

    return StationContextResponse(
        station=station,
        audio=audio_service.get_audio_by_station_id(station_id),
        safety_points=safety_service.get_safety_points_by_station_id(station_id),
        touch_resource=touch_service.get_touch_resource_by_station_id(station_id),
    )


@router.get("/{station_id}/audio", response_model=AudioGuideResponse)
def get_station_audio(station_id: str) -> AudioGuideResponse:
    """Obtiene la audioguía asociada a una estación."""
    if station_service.get_station_by_id(station_id) is None:
        raise HTTPException(status_code=404, detail="Station not found")

    audio = audio_service.get_audio_by_station_id(station_id)
    if audio is None:
        raise HTTPException(status_code=404, detail="Audio guide not found")
    return audio


@router.get("/{station_id}/safety", response_model=list[SafetyPointResponse])
def get_station_safety(station_id: str) -> list[SafetyPointResponse]:
    """Obtiene los puntos de seguridad de una estación (lista vacía si no hay)."""
    if station_service.get_station_by_id(station_id) is None:
        raise HTTPException(status_code=404, detail="Station not found")

    return safety_service.get_safety_points_by_station_id(station_id)


@router.get("/{station_id}/touch", response_model=TouchResourceResponse)
def get_station_touch(station_id: str) -> TouchResourceResponse:
    """Obtiene el recurso táctil asociado a una estación."""
    if station_service.get_station_by_id(station_id) is None:
        raise HTTPException(status_code=404, detail="Station not found")

    touch_resource = touch_service.get_touch_resource_by_station_id(station_id)
    if touch_resource is None:
        raise HTTPException(status_code=404, detail="Touch resource not found")
    return touch_resource


@router.get("/{station_id}", response_model=StationResponse)
def get_station(station_id: str) -> StationResponse:
    """Obtiene una estación por su ID interno (ej. "EST-001")."""
    station = station_service.get_station_by_id(station_id)
    if station is None:
        raise HTTPException(status_code=404, detail="Station not found")
    return station
