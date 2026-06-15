"""Esquema Pydantic para las audioguías de RUTAI.

Define el contrato de datos `AudioGuideResponse`. Cada estación puede tener un
audio asociado (voz humana + sonido ambiental, pregrabado en MP3).
"""

from pydantic import BaseModel


class AudioGuideResponse(BaseModel):
    """Representación pública de una audioguía asociada a una estación."""

    id: str
    station_id: str
    audio_type: str
    url: str
    transcript: str
    duration_seconds: int | None
    language: str
