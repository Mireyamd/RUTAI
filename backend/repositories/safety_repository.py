"""Safety point repository backed by Sprint 0 mock data."""

from data.mock_safety_points import MOCK_SAFETY_POINTS


def list_safety_points_by_station_id(station_id: str) -> list[dict]:
    """Return safety point records associated with a station."""
    return [
        point.copy()
        for point in MOCK_SAFETY_POINTS
        if point["station_id"] == station_id
    ]
