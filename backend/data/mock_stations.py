"""Datos mock de las estaciones del MVP de RUTAI.

Estructura temporal mientras no exista la base de datos. Respeta el contrato
definido en `schemas/station_schema.py` (StationResponse).
"""

MOCK_STATIONS: list[dict] = [
    {
        "id": "EST-001",
        "code": "001",
        "name": "Bienvenida y orientación",
        "type": "orientation",
        "order": 1,
        "short_description": "Inicio de la ruta sensorial RUTAI.",
        "long_description": (
            "Esta estación da la bienvenida al visitante, explica cómo funcionará "
            "la experiencia y orienta el inicio del recorrido."
        ),
        "audio_url": "/audio/estacion-01.mp3",
        "next_station_id": "EST-002",
    },
    {
        "id": "EST-002",
        "code": "002",
        "name": "Patrimonio sensorial",
        "type": "sensory_heritage",
        "order": 2,
        "short_description": "Estación para escuchar, tocar y comprender un rasgo patrimonial.",
        "long_description": (
            "Esta estación convierte un elemento visual del patrimonio en una "
            "experiencia auditiva, táctil y significativa."
        ),
        "audio_url": "/audio/estacion-02.mp3",
        "next_station_id": "EST-003",
    },
    {
        "id": "EST-003",
        "code": "003",
        "name": "Seguridad, reporte y cierre",
        "type": "safety_closure",
        "order": 3,
        "short_description": (
            "Cierre de la experiencia con advertencia de seguridad y reporte de barreras."
        ),
        "long_description": (
            "Esta estación permite identificar restricciones, reportar barreras y "
            "cerrar la ruta con una memoria sensorial."
        ),
        "audio_url": "/audio/estacion-03.mp3",
        "next_station_id": None,
    },
]
