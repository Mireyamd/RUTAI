"""Business logic for RUTAI stations.

Data is read through repositories/ so the source can move from mocks to
Supabase/PostgreSQL without changing routes or public contracts.
"""

from repositories import station_repository
from schemas.station_schema import StationResponse


def get_all_stations() -> list[StationResponse]:
    """Return all stations ordered by the `order` field."""
    stations = [
        StationResponse(**station)
        for station in station_repository.list_stations()
    ]
    return sorted(stations, key=lambda station: station.order)


def get_station_by_id(station_id: str) -> StationResponse | None:
    """Return the station with the given ID, or None when missing."""
    station = station_repository.get_station_by_id(station_id)
    if station is None:
        return None
    return StationResponse(**station)


def get_station_by_code(code: str) -> StationResponse | None:
    """Return the station with the given public code, or None when missing."""
    station = station_repository.get_station_by_code(code)
    if station is None:
        return None
    return StationResponse(**station)
