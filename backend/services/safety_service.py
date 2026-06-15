"""Lógica de negocio para los puntos de seguridad de RUTAI.

Hoy lee de datos mock (data/mock_safety_points.py). En sprints futuros esta capa
se reemplazará por consultas a Supabase/PostgreSQL manteniendo la misma interfaz.
"""

from data.mock_safety_points import MOCK_SAFETY_POINTS
from schemas.safety_schema import SafetyPointResponse


def get_safety_points_by_station_id(station_id: str) -> list[SafetyPointResponse]:
    """Devuelve los puntos de seguridad de la estación dada (lista vacía si no hay)."""
    return [
        SafetyPointResponse(**point)
        for point in MOCK_SAFETY_POINTS
        if point["station_id"] == station_id
    ]
