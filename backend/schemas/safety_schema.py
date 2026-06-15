"""Esquema Pydantic para los puntos de seguridad de RUTAI.

Define el contrato de datos `SafetyPointResponse`. Describe advertencias y
recomendaciones de seguridad validadas para una estación (suelo irregular,
restricciones de tacto, etc.).
"""

from pydantic import BaseModel


class SafetyPointResponse(BaseModel):
    """Representación pública de un punto de seguridad asociado a una estación."""

    id: str
    station_id: str
    type: str
    severity: str
    description: str
    recommendation: str
    validated_by: str | None
