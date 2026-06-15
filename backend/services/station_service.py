"""Lógica de negocio para las estaciones de RUTAI.

Hoy lee de datos mock (data/mock_stations.py). En sprints futuros esta capa se
reemplazará por consultas a Supabase/PostgreSQL manteniendo la misma interfaz.
"""

from data.mock_stations import MOCK_STATIONS
from schemas.station_schema import StationResponse


def get_all_stations() -> list[StationResponse]:
    """Devuelve todas las estaciones ordenadas por su campo `order`."""
    stations = [StationResponse(**station) for station in MOCK_STATIONS]
    return sorted(stations, key=lambda station: station.order)


def get_station_by_id(station_id: str) -> StationResponse | None:
    """Devuelve la estación con el ID dado o None si no existe."""
    for station in MOCK_STATIONS:
        if station["id"] == station_id:
            return StationResponse(**station)
    return None


def get_station_by_code(code: str) -> StationResponse | None:
    """Devuelve la estación con el código público dado o None si no existe."""
    for station in MOCK_STATIONS:
        if station["code"] == code:
            return StationResponse(**station)
    return None
