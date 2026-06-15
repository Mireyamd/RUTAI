"""Esquema Pydantic para los recursos táctiles de RUTAI.

Define el contrato de datos `TouchResourceResponse`. Describe qué se puede
explorar con el tacto en una estación (réplicas, materiales) y qué no debe
tocarse (piezas originales).
"""

from pydantic import BaseModel


class TouchResourceResponse(BaseModel):
    """Representación pública de un recurso táctil asociado a una estación."""

    id: str
    station_id: str
    name: str
    type: str
    touch_allowed: bool
    instruction: str
    restriction: str | None
    material: str | None
