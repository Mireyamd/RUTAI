"""Pruebas mínimas del Sprint 0 de RUTAI API.

Usan FastAPI TestClient importando la app desde main.py, por lo que no requieren
un servidor uvicorn corriendo. Validan que los endpoints principales no se rompan.
"""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "RUTAI API"


def test_list_stations():
    response = client.get("/api/stations")
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_get_station_by_id():
    response = client.get("/api/stations/EST-001")
    assert response.status_code == 200
    assert response.json()["id"] == "EST-001"


def test_get_station_by_code():
    response = client.get("/api/stations/by-code/001")
    assert response.status_code == 200
    assert response.json()["id"] == "EST-001"


def test_station_context_est_002():
    response = client.get("/api/stations/EST-002/context")
    assert response.status_code == 200
    body = response.json()
    assert body["station"]["id"] == "EST-002"
    assert body["audio"]["id"] == "AUD-002"
    assert any(point["id"] == "SEG-002" for point in body["safety_points"])
    assert body["touch_resource"]["id"] == "TAC-001"


def test_station_audio_est_002():
    response = client.get("/api/stations/EST-002/audio")
    assert response.status_code == 200
    assert response.json()["id"] == "AUD-002"


def test_station_safety_est_003():
    response = client.get("/api/stations/EST-003/safety")
    assert response.status_code == 200
    assert any(point["id"] == "SEG-001" for point in response.json())


def test_station_touch_est_002():
    response = client.get("/api/stations/EST-002/touch")
    assert response.status_code == 200
    assert response.json()["id"] == "TAC-001"


def test_station_not_found():
    response = client.get("/api/stations/EST-999")
    assert response.status_code == 404


def test_touch_not_found():
    response = client.get("/api/stations/EST-001/touch")
    assert response.status_code == 404


def test_create_barrier_report():
    response = client.post(
        "/api/reports",
        json={
            "station_id": "EST-003",
            "category": "audio_not_working",
            "description": "El audio no se reproduce en la estacion.",
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["id"].startswith("REP-")
    assert body["station_id"] == "EST-003"
    assert body["category"] == "audio_not_working"
    assert body["status"] == "open"
    assert body["description"] == "El audio no se reproduce en la estacion."
    assert "created_at" in body


def test_list_barrier_reports():
    client.post(
        "/api/reports",
        json={
            "station_id": "EST-002",
            "category": "signage_missing",
            "description": "Falta senalizacion tactil.",
        },
    )

    response = client.get("/api/reports")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert any(report["station_id"] == "EST-002" for report in body)


def test_create_barrier_report_station_not_found():
    response = client.post(
        "/api/reports",
        json={
            "station_id": "EST-999",
            "category": "unclear_route",
            "description": "La ruta no queda clara.",
        },
    )
    assert response.status_code == 404
    assert response.json()["detail"] == "Station not found"


def test_create_barrier_report_rejects_personal_data_fields():
    response = client.post(
        "/api/reports",
        json={
            "station_id": "EST-003",
            "category": "other",
            "description": "Comentario anonimo.",
            "email": "persona@example.com",
        },
    )
    assert response.status_code == 422
