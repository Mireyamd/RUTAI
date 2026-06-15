# RUTAI API — Backend

Backend de RUTAI construido con **FastAPI**. Expone los endpoints de salud y de
estaciones de la ruta sensorial accesible (MVP de 3 estaciones), incluyendo
audioguías, puntos de seguridad y recursos táctiles por estación.

> Sprint 0: datos mock en memoria. La estructura está preparada para migrar a
> Supabase/PostgreSQL en sprints posteriores sin cambiar las rutas ni los schemas.

## Estructura

```text
backend/
├── main.py                          # Crea la app, CORS, root e incluye routers
├── core/
│   └── config.py                    # Configuración vía variables de entorno
├── routes/
│   ├── health.py                    # GET /api/health
│   └── stations.py                  # Estaciones + context/audio/safety/touch
├── schemas/
│   ├── station_schema.py            # StationResponse
│   ├── audio_schema.py              # AudioGuideResponse
│   ├── safety_schema.py             # SafetyPointResponse
│   ├── touch_schema.py              # TouchResourceResponse
│   └── station_context_schema.py    # StationContextResponse (compuesto)
├── services/
│   ├── station_service.py           # Búsqueda de estaciones
│   ├── audio_service.py             # Audioguía por estación
│   ├── safety_service.py            # Puntos de seguridad por estación
│   └── touch_service.py             # Recurso táctil por estación
├── data/
│   ├── mock_stations.py             # 3 estaciones
│   ├── mock_audio_guides.py         # AUD-001..AUD-003
│   ├── mock_safety_points.py        # SEG-001, SEG-002
│   └── mock_touch_resources.py      # TAC-001
├── tests/
│   └── test_sprint_0_api.py         # 11 pruebas (FastAPI TestClient)
├── requirements.txt
├── .env.example
└── README.md
```

## 1. Crear el entorno virtual

Desde la carpeta `backend/`:

**Windows (PowerShell):**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux / macOS:**

```bash
python3 -m venv venv
source venv/bin/activate
```

## 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

## 3. Configurar variables de entorno (opcional)

Copia el archivo de ejemplo. Si no lo haces, se usan valores por defecto.

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**Linux / macOS:**

```bash
cp .env.example .env
```

## 4. Ejecutar las pruebas

Desde `backend/`:

```bash
python -m pytest
```

Deben pasar las 11 pruebas. Las pruebas usan `TestClient` e importan la app desde
`main.py`, por lo que **no requieren un servidor uvicorn corriendo**.

## 5. Levantar el backend

```bash
python -m uvicorn main:app --reload --port 8001
```

> Se recomienda el puerto **8001** porque el `8000` puede estar ocupado por otros
> servidores de desarrollo locales. Si `8000` está libre, también puedes omitir
> `--port` y usarlo por defecto.

El servidor queda disponible en `http://127.0.0.1:8001`.

## 6. Abrir Swagger

Documentación interactiva (OpenAPI):

- Swagger UI: `http://127.0.0.1:8001/docs`
- ReDoc: `http://127.0.0.1:8001/redoc`

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Punto de entrada informativo de la API |
| GET | `/api/health` | Estado del servicio |
| GET | `/api/stations` | Lista las 3 estaciones |
| GET | `/api/stations/{station_id}` | Estación por ID (ej. `EST-001`) |
| GET | `/api/stations/by-code/{code}` | Estación por código público (ej. `001`) |
| GET | `/api/stations/{station_id}/context` | Estación + audio + seguridad + tacto |
| GET | `/api/stations/{station_id}/audio` | Audioguía de la estación |
| GET | `/api/stations/{station_id}/safety` | Puntos de seguridad (lista, puede ir vacía) |
| GET | `/api/stations/{station_id}/touch` | Recurso táctil de la estación |

### Rutas principales de prueba

```text
/
/docs
/api/health
/api/stations
/api/stations/EST-002/context
/api/stations/EST-002/audio
/api/stations/EST-002/safety
/api/stations/EST-002/touch
```

```bash
curl http://127.0.0.1:8001/
curl http://127.0.0.1:8001/api/health
curl http://127.0.0.1:8001/api/stations
curl http://127.0.0.1:8001/api/stations/EST-002/context
curl http://127.0.0.1:8001/api/stations/EST-002/audio
curl http://127.0.0.1:8001/api/stations/EST-002/safety
curl http://127.0.0.1:8001/api/stations/EST-002/touch
```

### Respuestas 404

- Estación inexistente: `{"detail": "Station not found"}`
- Código inexistente: `{"detail": "Station code not found"}`
- Estación sin audioguía: `{"detail": "Audio guide not found"}`
- Estación sin recurso táctil: `{"detail": "Touch resource not found"}`

> `safety` nunca devuelve 404 por falta de datos: si la estación no tiene puntos
> de seguridad, responde `200` con una lista vacía `[]`.

## Notas

- **Sprint 0 usa datos mock**; Supabase/PostgreSQL aún no está conectado.
- No hay autenticación ni IA ni reportes reales todavía.
- `venv/` y `.env` no se suben al repositorio (ver `.gitignore`).

## Sprint 1 Backend

Sprint 1 agrega una capa `repositories/` entre servicios y mocks para preparar
la migracion a Supabase/PostgreSQL sin modificar rutas existentes. Tambien agrega
reportes anonimos de barreras:

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/reports` | Crea un reporte anonimo de barrera |
| GET | `/api/reports` | Lista reportes anonimos |

Los reportes no recolectan datos personales. El contrato completo Sprint 1,
modelo de datos propuesto, preparacion Supabase/PostgreSQL y criterios de no
recoleccion estan en `docs/sprint_1_backend.md`.
