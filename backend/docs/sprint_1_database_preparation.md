# Sprint 1 Database Preparation

Este documento define la base tecnica para migrar desde mocks hacia
Supabase/PostgreSQL sin romper los endpoints actuales ni el frontend.

## Principios

- Los contratos publicos actuales se mantienen.
- `routes/` no debe depender de detalles de base de datos.
- `services/` conserva reglas de negocio y devuelve schemas Pydantic.
- `repositories/` sera el unico punto que cambia de mocks a PostgreSQL.
- Los mocks no se eliminan hasta que los repositorios PostgreSQL tengan tests.
- El backend debe seguir funcionando sin `.env` y sin `DATABASE_URL`.
- No se recolectan datos personales en reportes.

## Variables de entorno propuestas

| Variable | Uso futuro | Obligatoria ahora |
|---|---|---|
| `APP_ENV` | Ambiente de ejecucion (`development`, `test`, `production`) | No |
| `DATABASE_URL` | Conexion directa PostgreSQL | No |
| `SUPABASE_URL` | URL del proyecto Supabase | No |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones backend privilegiadas, solo servidor | No |
| `SUPABASE_ANON_KEY` | Cliente anonimo si se necesitara lectura limitada | No |

`SUPABASE_SERVICE_ROLE_KEY` nunca debe exponerse al frontend ni enviarse al
navegador. En Sprint 1 no se usa todavia.

## Tablas propuestas

### `stations`

Tabla fuente del contrato `StationResponse`.

| Columna | Tipo | Mapea a contrato |
|---|---|---|
| `id` | text primary key | `id` |
| `code` | text unique not null | `code` |
| `name` | text not null | `name` |
| `type` | text not null | `type` |
| `display_order` | integer not null | `order` |
| `short_description` | text not null | `short_description` |
| `long_description` | text not null | `long_description` |
| `audio_url` | text nullable | `audio_url` |
| `next_station_id` | text nullable | `next_station_id` |
| `created_at` | timestamptz | No publico |
| `updated_at` | timestamptz | No publico |

Relacion: `next_station_id` referencia `stations.id`.

Nota: se propone `display_order` para evitar ambiguedad con palabras reservadas
o nombres genericos. El repositorio lo mapeara a `order` al construir el schema.

### `audio_guides`

Tabla fuente del contrato `AudioGuideResponse`.

| Columna | Tipo | Mapea a contrato |
|---|---|---|
| `id` | text primary key | `id` |
| `station_id` | text not null | `station_id` |
| `audio_type` | text not null | `audio_type` |
| `url` | text not null | `url` |
| `transcript` | text not null | `transcript` |
| `duration_seconds` | integer nullable | `duration_seconds` |
| `language` | text not null | `language` |
| `created_at` | timestamptz | No publico |
| `updated_at` | timestamptz | No publico |

Relacion: `station_id` referencia `stations.id`.

### `safety_points`

Tabla fuente de `list[SafetyPointResponse]`.

| Columna | Tipo | Mapea a contrato |
|---|---|---|
| `id` | text primary key | `id` |
| `station_id` | text not null | `station_id` |
| `type` | text not null | `type` |
| `severity` | text not null | `severity` |
| `description` | text not null | `description` |
| `recommendation` | text not null | `recommendation` |
| `validated_by` | text nullable | `validated_by` |
| `created_at` | timestamptz | No publico |
| `updated_at` | timestamptz | No publico |

Relacion: `station_id` referencia `stations.id`.

### `touch_resources`

Tabla fuente del contrato `TouchResourceResponse`.

| Columna | Tipo | Mapea a contrato |
|---|---|---|
| `id` | text primary key | `id` |
| `station_id` | text not null unique | `station_id` |
| `name` | text not null | `name` |
| `type` | text not null | `type` |
| `touch_allowed` | boolean not null | `touch_allowed` |
| `instruction` | text not null | `instruction` |
| `restriction` | text nullable | `restriction` |
| `material` | text nullable | `material` |
| `created_at` | timestamptz | No publico |
| `updated_at` | timestamptz | No publico |

Relacion: `station_id` referencia `stations.id`.

### `barrier_reports`

Tabla fuente del contrato `BarrierReportResponse`.

| Columna | Tipo | Mapea a contrato |
|---|---|---|
| `id` | uuid primary key | `id` como string |
| `station_id` | text not null | `station_id` |
| `category` | text not null | `category` |
| `description` | text nullable | `description` |
| `status` | text not null | `status` |
| `created_at` | timestamptz | `created_at` |
| `updated_at` | timestamptz | No publico |

Relacion: `station_id` referencia `stations.id`.

Categorias permitidas:

- `signage_missing`
- `audio_not_working`
- `unclear_route`
- `needed_assistance`
- `other`

Estados permitidos:

- `open`
- `reviewing`
- `resolved`
- `dismissed`

## Datos que no se deben recolectar

Los reportes de barreras deben seguir siendo anonimos. No agregar columnas,
schemas ni parametros para:

- nombre
- DNI u otro documento
- correo
- telefono
- direccion personal
- ubicacion precisa del visitante
- datos de salud
- identificadores de dispositivo

El contexto de estacion ya indica donde ocurre la barrera mediante `station_id`;
no se necesita ubicacion personal.

## Mapeo a contratos actuales

| Contrato API | Tabla origen | Regla de mapeo |
|---|---|---|
| `StationResponse` | `stations` | `display_order` se expone como `order`; timestamps no se exponen. |
| `AudioGuideResponse` | `audio_guides` | Una audioguia por estacion en endpoints actuales. |
| `SafetyPointResponse` | `safety_points` | Lista filtrada por `station_id`; lista vacia si no hay puntos. |
| `TouchResourceResponse` | `touch_resources` | Recurso unico por estacion en contrato actual. |
| `StationContextResponse` | Todas las anteriores | Composicion en service, no en ruta. |
| `BarrierReportResponse` | `barrier_reports` | UUID se serializa como string; no se exponen datos internos. |

## Plan de migracion sin romper frontend

1. Mantener tests actuales de contrato con mocks.
2. Crear repositorios PostgreSQL paralelos o funciones internas alternativas.
3. Agregar una decision de origen de datos por configuracion, por ejemplo
   `DATA_SOURCE=mock|postgres`, con default `mock`.
4. Implementar consultas PostgreSQL que devuelvan dicts con la misma forma que
   los mocks actuales.
5. Ejecutar los mismos tests contra repositorios mock.
6. Agregar tests de integracion PostgreSQL/Supabase en suite separada, no
   requerida para ejecucion local basica.
7. Cambiar entorno de staging a PostgreSQL manteniendo endpoints y schemas.
8. Solo despues de validar staging, considerar mover produccion.

## Decisiones pendientes

- Elegir cliente de base de datos: SQLAlchemy, asyncpg, psycopg o supabase-py.
- Definir si los IDs publicos actuales (`EST-001`) se mantienen como primary key
  o si se agrega un UUID interno y se conserva `id` como codigo publico estable.
- Definir politica RLS de Supabase. Para backend server-side puede usarse service
  role, pero nunca desde frontend.
- Definir si audios viven en Supabase Storage o en hosting estatico.
