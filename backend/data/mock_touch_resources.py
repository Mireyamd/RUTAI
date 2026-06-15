"""Datos mock de los recursos táctiles del MVP de RUTAI.

Estructura temporal mientras no exista la base de datos. Respeta el contrato
definido en `schemas/touch_schema.py` (TouchResourceResponse). Indican qué se
puede explorar con el tacto y qué no debe tocarse.
"""

MOCK_TOUCH_RESOURCES: list[dict] = [
    {
        "id": "TAC-001",
        "station_id": "EST-002",
        "name": "Réplica táctil del elemento patrimonial",
        "type": "replica",
        "touch_allowed": True,
        "instruction": (
            "Puedes explorar esta réplica con ambas manos para reconocer su forma "
            "y textura."
        ),
        "restriction": (
            "No toques la pieza original; está protegida y es frágil."
        ),
        "material": "Resina con acabado texturizado",
    },
]
