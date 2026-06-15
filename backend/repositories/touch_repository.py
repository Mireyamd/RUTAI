"""Touch resource repository backed by Sprint 0 mock data."""

from data.mock_touch_resources import MOCK_TOUCH_RESOURCES


def get_touch_resource_by_station_id(station_id: str) -> dict | None:
    """Return the touch resource record associated with a station."""
    for resource in MOCK_TOUCH_RESOURCES:
        if resource["station_id"] == station_id:
            return resource.copy()
    return None
