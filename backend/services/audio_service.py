"""Business logic for RUTAI audio guides."""

from repositories import audio_repository
from schemas.audio_schema import AudioGuideResponse


def get_audio_by_station_id(station_id: str) -> AudioGuideResponse | None:
    """Return the audio guide for a station, or None when missing."""
    audio = audio_repository.get_audio_by_station_id(station_id)
    if audio is None:
        return None
    return AudioGuideResponse(**audio)
