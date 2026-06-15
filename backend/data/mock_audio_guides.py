"""Datos mock de las audioguías del MVP de RUTAI.

Estructura temporal mientras no exista la base de datos. Respeta el contrato
definido en `schemas/audio_schema.py` (AudioGuideResponse). Hay una audioguía
por cada estación de la ruta.
"""

MOCK_AUDIO_GUIDES: list[dict] = [
    {
        "id": "AUD-001",
        "station_id": "EST-001",
        "audio_type": "narracion",
        "url": "/audio/estacion-01.mp3",
        "transcript": (
            "Bienvenido a RUTAI. Te acompaño en esta ruta sensorial. En esta "
            "primera estación te explico cómo funcionará la experiencia y cómo "
            "orientarte para iniciar el recorrido con seguridad."
        ),
        "duration_seconds": 90,
        "language": "es",
    },
    {
        "id": "AUD-002",
        "station_id": "EST-002",
        "audio_type": "narracion",
        "url": "/audio/estacion-02.mp3",
        "transcript": (
            "Estás en la estación de patrimonio sensorial. Aquí puedes escuchar y "
            "explorar con el tacto una réplica del elemento patrimonial. La pieza "
            "original no debe tocarse; el recurso táctil sí puede explorarse."
        ),
        "duration_seconds": 120,
        "language": "es",
    },
    {
        "id": "AUD-003",
        "station_id": "EST-003",
        "audio_type": "narracion",
        "url": "/audio/estacion-03.mp3",
        "transcript": (
            "Llegaste a la estación de seguridad y cierre. Esta zona tiene una "
            "advertencia: el suelo es irregular, avanza con calma y pide apoyo si "
            "lo necesitas. Aquí también puedes reportar barreras y cerrar la ruta."
        ),
        "duration_seconds": 105,
        "language": "es",
    },
]
