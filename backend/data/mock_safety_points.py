"""Datos mock de los puntos de seguridad del MVP de RUTAI.

Estructura temporal mientras no exista la base de datos. Respeta el contrato
definido en `schemas/safety_schema.py` (SafetyPointResponse). Los puntos de
seguridad son advertencias validadas para una estación.
"""

MOCK_SAFETY_POINTS: list[dict] = [
    {
        "id": "SEG-001",
        "station_id": "EST-003",
        "type": "suelo_irregular",
        "severity": "media",
        "description": (
            "El suelo de esta zona es irregular y puede tener desniveles."
        ),
        "recommendation": (
            "Avanza con calma y pide apoyo a tu guía o acompañante si lo necesitas."
        ),
        "validated_by": "Equipo RUTAI",
    },
    {
        "id": "SEG-002",
        "station_id": "EST-002",
        "type": "restriccion_tacto",
        "severity": "alta",
        "description": (
            "La pieza patrimonial original es frágil y no debe tocarse."
        ),
        "recommendation": (
            "Explora únicamente la réplica táctil habilitada para esta estación."
        ),
        "validated_by": "Equipo RUTAI",
    },
]
