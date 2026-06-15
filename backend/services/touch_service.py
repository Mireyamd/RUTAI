"""Lógica de negocio para los recursos táctiles de RUTAI.

Hoy lee de datos mock (data/mock_touch_resources.py). En sprints futuros esta
capa se reemplazará por consultas a Supabase/PostgreSQL manteniendo la misma
interfaz.
"""

from data.mock_touch_resources import MOCK_TOUCH_RESOURCES
from schemas.touch_schema import TouchResourceResponse


def get_touch_resource_by_station_id(station_id: str) -> TouchResourceResponse | None:
    """Devuelve el recurso táctil de la estación dada o None si no existe."""
    for resource in MOCK_TOUCH_RESOURCES:
        if resource["station_id"] == station_id:
            return TouchResourceResponse(**resource)
    return None
