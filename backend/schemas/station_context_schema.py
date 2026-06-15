"""Esquema Pydantic para el contexto completo de una estación de RUTAI.

Define el contrato de datos `StationContextResponse`, que agrupa en una sola
respuesta la estación con su audioguía, sus puntos de seguridad y su recurso
táctil. Alimenta la experiencia guiada de la PWA por estación.
"""

from pydantic import BaseModel

from schemas.audio_schema import AudioGuideResponse
from schemas.safety_schema import SafetyPointResponse
from schemas.station_schema import StationResponse
from schemas.touch_schema import TouchResourceResponse


class StationContextResponse(BaseModel):
    """Contexto completo de una estación: datos, audio, seguridad y tacto."""

    station: StationResponse
    audio: AudioGuideResponse | None
    safety_points: list[SafetyPointResponse]
    touch_resource: TouchResourceResponse | None
