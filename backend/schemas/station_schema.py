"""Esquemas Pydantic para las estaciones de RUTAI.

Define el contrato de datos `StationResponse` compartido con el frontend.
"""

from pydantic import BaseModel


class StationResponse(BaseModel):
    """Representación pública de una estación RUTAI."""

    id: str
    code: str
    name: str
    type: str
    order: int
    short_description: str
    long_description: str
    audio_url: str | None
    next_station_id: str | None
