"""Business logic for RUTAI safety points."""

from repositories import safety_repository
from schemas.safety_schema import SafetyPointResponse


def get_safety_points_by_station_id(station_id: str) -> list[SafetyPointResponse]:
    """Return safety points for a station, or an empty list when none exist."""
    return [
        SafetyPointResponse(**point)
        for point in safety_repository.list_safety_points_by_station_id(station_id)
    ]
