"""Business logic for RUTAI touch resources."""

from repositories import touch_repository
from schemas.touch_schema import TouchResourceResponse


def get_touch_resource_by_station_id(station_id: str) -> TouchResourceResponse | None:
    """Return the touch resource for a station, or None when missing."""
    resource = touch_repository.get_touch_resource_by_station_id(station_id)
    if resource is None:
        return None
    return TouchResourceResponse(**resource)
