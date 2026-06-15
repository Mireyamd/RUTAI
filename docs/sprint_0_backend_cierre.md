# RUTAI — Cierre del Sprint 0 (Backend)

Documento de cierre del backend de RUTAI. Permite que otro desarrollador pueda
**levantar, probar y entender** el estado del Sprint 0 sin contexto previo.

---

## 1. Objetivo del Sprint 0

Crear la base técnica del backend de RUTAI con FastAPI: estructura profesional y
modular, endpoints de salud y de estaciones, contrato de datos (schemas Pydantic),
servicios separados, datos mock de las 3 estaciones del MVP y pruebas
automatizadas. Todo preparado para migrar a Supabase/PostgreSQL sin romper rutas
ni contratos.

## 2. Alcance realizado

- App FastAPI modular (`main.py` solo crea app, CORS, root e incluye routers).
- Endpoint raíz informativo `/`.
- Health check `/api/health`.
- CRUD de lectura de estaciones (lista, por id, por código).
- Contexto completo de estación (`/context`).
- Endpoints separados de audio, seguridad y tacto por estación.
- Schemas Pydantic para estación, audio, seguridad, tacto y contexto.
- Servicios separados por dominio.
- Datos mock de estaciones, audioguías, puntos de seguridad y recurso táctil.
- 11 pruebas automatizadas (todas pasando).
- Documento de modelo de datos (`docs/modelo_datos_sprint_0.md`).

## 3. Endpoints disponibles

| Método | Ruta | Descripción | 404 |
|---|---|---|---|
| GET | `/` | Punto de entrada informativo | — |
| GET | `/api/health` | Estado del servicio | — |
| GET | `/api/stations` | Lista las 3 estaciones | — |
| GET | `/api/stations/{station_id}` | Estación por ID | "Station not found" |
| GET | `/api/stations/by-code/{code}` | Estación por código público | "Station code not found" |
| GET | `/api/stations/{station_id}/context` | Estación + audio + seguridad + tacto | "Station not found" |
| GET | `/api/stations/{station_id}/audio` | Audioguía de la estación | "Station not found" / "Audio guide not found" |
| GET | `/api/stations/{station_id}/safety` | Puntos de seguridad (lista) | "Station not found" |
| GET | `/api/stations/{station_id}/touch` | Recurso táctil | "Station not found" / "Touch resource not found" |

> `safety` devuelve `200` con `[]` si la estación no tiene puntos de seguridad
> (no es un 404).

Documentación interactiva: `/docs` (Swagger) y `/redoc`.

## 4. Estructura del backend

```text
backend/
├── main.py
├── core/config.py
├── routes/        health.py, stations.py
├── schemas/       station, audio, safety, touch, station_context
├── services/      station, audio, safety, touch
├── data/          mock_stations, mock_audio_guides, mock_safety_points, mock_touch_resources
├── tests/         test_sprint_0_api.py
├── requirements.txt
├── .env.example
└── README.md
```

## 5. Schemas creados (`schemas/`)

| Schema | Archivo | Uso |
|---|---|---|
| `StationResponse` | `station_schema.py` | Datos de estación |
| `AudioGuideResponse` | `audio_schema.py` | Audioguía |
| `SafetyPointResponse` | `safety_schema.py` | Punto de seguridad |
| `TouchResourceResponse` | `touch_schema.py` | Recurso táctil |
| `StationContextResponse` | `station_context_schema.py` | Compone los anteriores |

## 6. Servicios creados (`services/`)

| Servicio | Función principal |
|---|---|
| `station_service.py` | `get_all_stations`, `get_station_by_id`, `get_station_by_code` |
| `audio_service.py` | `get_audio_by_station_id` |
| `safety_service.py` | `get_safety_points_by_station_id` |
| `touch_service.py` | `get_touch_resource_by_station_id` |

## 7. Mocks disponibles (`data/`)

| Mock | Contenido |
|---|---|
| `mock_stations.py` | EST-001, EST-002, EST-003 |
| `mock_audio_guides.py` | AUD-001 (EST-001), AUD-002 (EST-002), AUD-003 (EST-003) |
| `mock_safety_points.py` | SEG-001 (EST-003, suelo_irregular), SEG-002 (EST-002, restriccion_tacto) |
| `mock_touch_resources.py` | TAC-001 (EST-002) |

## 8. Pruebas automatizadas

11 pruebas en `tests/test_sprint_0_api.py` con FastAPI `TestClient` (importan la
app desde `main.py`, no requieren servidor corriendo): health, root, listado,
estación por id, estación por código, contexto EST-002, audio EST-002, seguridad
EST-003, tacto EST-002, estación inexistente (404) y tacto inexistente (404).

## 9. Comandos

**Levantar servidor (puerto recomendado 8001):**

```bash
python -m uvicorn main:app --reload --port 8001
```

**Correr pruebas (desde `backend/`):**

```bash
python -m pytest
```

**Puerto recomendado:** usar `8001` si el `8000` está ocupado por otro servidor
de desarrollo local. Con `8000` libre puede omitirse `--port`.

## 10. Limitaciones actuales

- El backend **aún trabaja con mocks** en memoria.
- **Supabase/PostgreSQL no está conectado todavía.**
- **No hay autenticación.**
- **No hay IA todavía.**
- **No hay reportes reales todavía.**
- No hay geometrías PostGIS (previstas pero no implementadas).

## 11. Qué queda para Sprint 1

Ver `docs/sprint_1_preparacion.md`. En resumen: conectar Supabase/PostgreSQL con
tablas base y seeds, reemplazar los servicios mock por repositorios manteniendo
las mismas firmas, y conservar las pruebas. Luego, conectar el frontend PWA.

## 12. Notas de repositorio

- La carpeta **`rutai_ai_guides/` no debe subirse al repositorio** (guía local de
  agentes). Está protegida en `.gitignore`.
- El entorno **`venv/` no debe subirse al repositorio**. Está protegido en
  `.gitignore`, junto con `.env` y `__pycache__/`.
