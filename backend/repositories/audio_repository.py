"""Audio guide repository backed by Sprint 0 mock data."""

from data.mock_audio_guides import MOCK_AUDIO_GUIDES


def get_audio_by_station_id(station_id: str) -> dict | None:
    """Return the audio guide record associated with a station."""
    for audio in MOCK_AUDIO_GUIDES:
        if audio["station_id"] == station_id:
            return audio.copy()
    return None
