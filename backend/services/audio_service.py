"""Lógica de negocio para las audioguías de RUTAI.

Hoy lee de datos mock (data/mock_audio_guides.py). En sprints futuros esta capa
se reemplazará por consultas a Supabase/PostgreSQL manteniendo la misma interfaz.
"""

from data.mock_audio_guides import MOCK_AUDIO_GUIDES
from schemas.audio_schema import AudioGuideResponse


def get_audio_by_station_id(station_id: str) -> AudioGuideResponse | None:
    """Devuelve la audioguía de la estación dada o None si no existe."""
    for audio in MOCK_AUDIO_GUIDES:
        if audio["station_id"] == station_id:
            return AudioGuideResponse(**audio)
    return None
