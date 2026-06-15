# RUTAI Backend Sprint 1

Este documento prepara la transicion desde mocks hacia Supabase/PostgreSQL sin
romper los contratos cerrados en Sprint 0.

## Contrato API

Los endpoints de Sprint 0 se mantienen sin cambios:

| Metodo | Ruta |
|---|---|
| GET | `/` |
| GET | `/api/health` |
| GET | `/api/stations` |
| GET | `/api/stations/{station_id}` |
| GET | `/api/stations/by-code/{code}` |
| GET | `/api/stations/{station_id}/context` |
| GET | `/api/stations/{station_id}/audio` |
| GET | `/api/stations/{station_id}/safety` |
| GET | `/api/stations/{station_id}/touch` |

Sprint 1 agrega reportes anonimos de barreras:

| Metodo | Ruta | Descripcion |
|---|---|---|
| POST | `/api/reports` | Crea un reporte anonimo para una estacion existente |
| GET | `/api/reports` | Lista reportes anonimos registrados |

### POST `/api/reports`

Request:

```json
{
  "station_id": "EST-003",
  "category": "audio_not_working",
  "description": "El audio no se reproduce en la estacion."
}
```

Campos aceptados:

| Campo | Tipo | Regla |
|---|---|---|
| `station_id` | string | Requerido. Debe existir en estaciones. |
| `category` | string | Requerido. Debe ser una categoria permitida. |
| `description` | string/null | Opcional. Maximo 1000 caracteres. |
| `created_at` | datetime/null | Opcional. Si no llega, el backend lo genera. |

Categorias permitidas:

- `signage_missing`
- `audio_not_working`
- `unclear_route`
- `needed_assistance`
- `other`

Response `201`:

```json
{
  "id": "REP-001",
  "station_id": "EST-003",
  "category": "audio_not_working",
  "description": "El audio no se reproduce en la estacion.",
  "status": "open",
  "created_at": "2026-06-15T16:00:00Z"
}
```

Errores:

- `404 {"detail": "Station not found"}` cuando `station_id` no existe.
- `422` cuando la categoria no esta permitida o llegan campos no aceptados.

## Modelo de datos propuesto

### `stations`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text primary key | Ej. `EST-001`. Mantiene contrato actual. |
| `code` | text unique not null | Codigo publico. Ej. `001`. |
| `name` | text not null | Nombre de estacion. |
| `type` | text not null | Tipo funcional. |
| `order` | integer not null | Orden de recorrido. |
| `short_description` | text not null | Resumen corto. |
| `long_description` | text not null | Descripcion completa. |
| `audio_url` | text nullable | URL publica/local del audio. |
| `next_station_id` | text nullable | FK a `stations.id`. |

### `audio_guides`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text primary key | Ej. `AUD-001`. |
| `station_id` | text not null | FK a `stations.id`. |
| `audio_type` | text not null | Ej. `narracion`. |
| `url` | text not null | Ubicacion del MP3. |
| `transcript` | text not null | Texto accesible del audio. |
| `duration_seconds` | integer nullable | Duracion estimada. |
| `language` | text not null | Ej. `es`. |

### `safety_points`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text primary key | Ej. `SEG-001`. |
| `station_id` | text not null | FK a `stations.id`. |
| `type` | text not null | Tipo de advertencia. |
| `severity` | text not null | Ej. `media`, `alta`. |
| `description` | text not null | Riesgo contextual. |
| `recommendation` | text not null | Accion sugerida. |
| `validated_by` | text nullable | Equipo o rol validador. |

### `touch_resources`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text primary key | Ej. `TAC-001`. |
| `station_id` | text not null | FK a `stations.id`. |
| `name` | text not null | Nombre del recurso. |
| `type` | text not null | Ej. `replica`. |
| `touch_allowed` | boolean not null | Si puede explorarse con tacto. |
| `instruction` | text not null | Instruccion accesible. |
| `restriction` | text nullable | Restriccion de seguridad o conservacion. |
| `material` | text nullable | Material del recurso. |

### `barrier_reports`

| Columna | Tipo | Notas |
|---|---|---|
| `id` | text primary key | Ej. `REP-001`, o UUID en PostgreSQL. |
| `station_id` | text not null | FK a `stations.id`. |
| `category` | text not null | Categoria permitida. |
| `description` | text nullable | Comentario anonimo. |
| `status` | text not null default `open` | Flujo gestor futuro. |
| `created_at` | timestamptz not null default now() | Fecha de creacion. |

Categorias de `barrier_reports.category`:

- `signage_missing`
- `audio_not_working`
- `unclear_route`
- `needed_assistance`
- `other`

Estados de `barrier_reports.status`:

- `open`
- `reviewing`
- `resolved`
- `dismissed`

## Capa de repositorios

La estructura nueva es:

```text
backend/
|-- repositories/
|   |-- station_repository.py
|   |-- audio_repository.py
|   |-- safety_repository.py
|   |-- touch_repository.py
|   `-- report_repository.py
|-- services/
|   |-- station_service.py
|   |-- audio_service.py
|   |-- safety_service.py
|   |-- touch_service.py
|   `-- report_service.py
`-- data/
    `-- mock_barrier_reports.py
```

Regla de arquitectura:

- `routes/` solo conoce schemas y services.
- `services/` aplica reglas de negocio y devuelve schemas publicos.
- `repositories/` concentra acceso a datos.
- `data/` mantiene mocks temporales.

Para Supabase/PostgreSQL, se reemplaza la implementacion interna de
`repositories/*_repository.py`. Las firmas de services y routes deben mantenerse.

## Panel gestor futuro

El panel gestor deberia consumir `GET /api/reports` y actualizar estados en un
endpoint futuro, por ejemplo `PATCH /api/reports/{report_id}`. Ese endpoint no
se agrega en Sprint 1 porque todavia no hay autenticacion ni roles.

Funciones previstas:

- Ver reportes por estacion.
- Filtrar por `status` y `category`.
- Cambiar estado operativo.
- Priorizar barreras de seguridad o accesibilidad.

## Preparacion Supabase/PostgreSQL

Pendientes antes de conectar Supabase:

- Definir migraciones SQL para las tablas propuestas.
- Usar claves foraneas desde entidades dependientes hacia `stations.id`.
- Mantener IDs actuales o mapearlos a UUID sin cambiar los campos publicos.
- Decidir ubicacion de audios: Supabase Storage o hosting estatico.
- Configurar variables de entorno sin exponer service keys al frontend.
- Mantener tests de contrato con TestClient antes de activar repositorios reales.

## No recoleccion de datos personales

Los reportes de barreras son anonimos. El backend no acepta ni solicita:

- nombre
- DNI u otro documento
- correo
- telefono
- direccion
- ubicacion precisa del visitante

`BarrierReportCreate` usa `extra="forbid"`, por lo que campos no definidos como
`email`, `phone`, `name` o similares responden `422`.
