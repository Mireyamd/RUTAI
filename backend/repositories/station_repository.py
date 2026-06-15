"""Station repository backed by Sprint 0 mock data."""

from data.mock_stations import MOCK_STATIONS


def list_stations() -> list[dict]:
    """Return all station records."""
    return [station.copy() for station in MOCK_STATIONS]


def get_station_by_id(station_id: str) -> dict | None:
    """Return one station record by internal ID."""
    for station in MOCK_STATIONS:
        if station["id"] == station_id:
            return station.copy()
    return None


def get_station_by_code(code: str) -> dict | None:
    """Return one station record by public code."""
    for station in MOCK_STATIONS:
        if station["code"] == code:
            return station.copy()
    return None
