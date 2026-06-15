# RUTAI — Modelo de datos (Sprint 0)

Este documento describe el **modelo relacional inicial** de RUTAI, preparado para
**Supabase / PostgreSQL**. Es una guía de diseño: **no se ejecutan migraciones
todavía** y **no se conecta Supabase** en esta fase. El backend actual sigue
funcionando con datos mock en `backend/data/`.

El modelo está alineado al MVP de una **ruta sensorial accesible de 3 estaciones**
(EST-001, EST-002, EST-003) y evita sobrecomplicarse con tablas innecesarias.

> **Nota PostGIS:** PostGIS se usará en fase posterior para puntos geográficos,
> rutas y servicios accesibles. En Sprint 0 se dejan previstos los campos
> geográficos pero **no se implementan geometrías todavía**.

---

## Convenciones generales

- Motor: PostgreSQL (Supabase).
- Claves primarias: se sugiere `uuid` (`gen_random_uuid()`), manteniendo además
  un **código de negocio legible** (`code`, ej. `EST-001`, `AUD-001`) para las
  URLs accesibles y la trazabilidad con los mocks actuales.
- Marcas de tiempo: `created_at timestamptz default now()` y, donde aplique,
  `updated_at timestamptz`.
- Sin datos personales sensibles (ver tabla `station_events`).
- Nombres de tabla en plural y en inglés, consistentes con los schemas actuales.

---

## 1. attractions

**Propósito:** atractivo turístico que agrupa una o varias rutas/estaciones. En el
MVP habrá un único atractivo, pero la tabla permite escalar a más sitios.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `code` | `text` unique | Código de negocio legible. |
| `name` | `text` not null | Nombre del atractivo. |
| `description` | `text` | Descripción general. |
| `city` | `text` | Ciudad/localidad. |
| `geo_point` | `geography(Point,4326)` *(fase PostGIS)* | Ubicación. No se implementa aún. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** ninguna.
- **Relaciones:** `1 attraction → N stations`.
- **Observaciones MVP:** una sola fila esperada; sirve de raíz del modelo.

---

## 2. stations

**Propósito:** cada estación de la ruta sensorial. Reemplaza al mock
`mock_stations.py` y respeta el contrato `StationResponse`.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `attraction_id` | `uuid` FK → attractions.id | Atractivo al que pertenece. |
| `code` | `text` unique | Código público para URL (`001`, `002`, `003`). |
| `name` | `text` not null | Nombre visible. |
| `type` | `text` not null | `orientation` / `sensory_heritage` / `safety_closure`. |
| `order` | `int` not null | Orden en la ruta. |
| `short_description` | `text` | Descripción corta accesible. |
| `long_description` | `text` | Descripción extendida. |
| `audio_url` | `text` | Audio principal (compatibilidad con contrato actual). |
| `next_station_id` | `uuid` FK → stations.id (nullable) | Siguiente estación o NULL si es cierre. |
| `geo_point` | `geography(Point,4326)` *(fase PostGIS)* | Ubicación interna. No se implementa aún. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `attraction_id → attractions.id`; `next_station_id → stations.id` (auto-referencia).
- **Relaciones:** pertenece a `attractions`; tiene `audio_guides`, `safety_points`,
  `touch_resources`, `barrier_reports` y `station_events` asociados.
- **Observaciones MVP:** 3 filas (EST-001, EST-002, EST-003). `type` puede
  validarse con CHECK o enum en fase posterior.

---

## 3. audio_guides

**Propósito:** audioguías por estación (voz humana + ambiente, MP3 pregrabado).
Reemplaza el mock `mock_audio_guides.py` y respeta `AudioGuideResponse`.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `station_id` | `uuid` FK → stations.id | Estación a la que pertenece. |
| `code` | `text` unique | Código legible (`AUD-001`). |
| `audio_type` | `text` not null | Tipo (`narracion`, etc.). |
| `url` | `text` not null | Ruta/almacenamiento del audio. |
| `transcript` | `text` | Transcripción accesible. |
| `duration_seconds` | `int` nullable | Duración. |
| `language` | `text` not null default 'es' | Idioma del audio. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `station_id → stations.id`.
- **Relaciones:** `1 station → N audio_guides` (en el MVP, 1 por estación).
- **Observaciones MVP:** 3 filas (AUD-001..AUD-003). El contrato actual del
  endpoint de contexto devuelve un único audio por estación.

---

## 4. safety_points

**Propósito:** advertencias y recomendaciones de seguridad validadas para una
estación. Reemplaza `mock_safety_points.py` y respeta `SafetyPointResponse`.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `station_id` | `uuid` FK → stations.id (nullable) | Estación asociada (puede ser NULL si es general). |
| `code` | `text` unique | Código legible (`SEG-001`). |
| `type` | `text` not null | `suelo_irregular`, `restriccion_tacto`, etc. |
| `severity` | `text` not null | `baja` / `media` / `alta`. |
| `description` | `text` not null | Descripción de la advertencia. |
| `recommendation` | `text` not null | Recomendación accesible. |
| `validated_by` | `text` nullable | Quién validó la información. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `station_id → stations.id` (nullable: un punto **puede** pertenecer a una estación).
- **Relaciones:** `1 station → N safety_points`.
- **Observaciones MVP:** al menos SEG-001 (EST-003) y SEG-002 (EST-002). La
  información de seguridad **no** debe generarse con IA libre.

---

## 5. touch_resources

**Propósito:** recursos táctiles por estación (réplicas, materiales), indicando
qué se puede tocar y qué no. Reemplaza `mock_touch_resources.py` y respeta
`TouchResourceResponse`.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `station_id` | `uuid` FK → stations.id | Estación a la que pertenece. |
| `code` | `text` unique | Código legible (`TAC-001`). |
| `name` | `text` not null | Nombre del recurso. |
| `type` | `text` not null | `replica`, `material`, etc. |
| `touch_allowed` | `boolean` not null | Si el recurso puede tocarse. |
| `instruction` | `text` not null | Cómo explorarlo. |
| `restriction` | `text` nullable | Qué no debe tocarse (ej. pieza original). |
| `material` | `text` nullable | Material del recurso. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `station_id → stations.id`.
- **Relaciones:** `1 station → N touch_resources` (en el MVP, 0 o 1 por estación).
- **Observaciones MVP:** al menos TAC-001 (EST-002): se puede tocar la réplica,
  no la pieza original.

---

## 6. route_segments

**Propósito:** conexiones entre estaciones (tramo del recorrido). Permite describir
el orden, la distancia y, en fase posterior, la geometría del trayecto accesible.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `from_station_id` | `uuid` FK → stations.id | Estación de origen. |
| `to_station_id` | `uuid` FK → stations.id | Estación de destino. |
| `instructions` | `text` | Indicaciones accesibles del tramo. |
| `distance_meters` | `int` nullable | Distancia aproximada. |
| `path_geom` | `geography(LineString,4326)` *(fase PostGIS)* | Trazado del tramo. No se implementa aún. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `from_station_id → stations.id`; `to_station_id → stations.id`.
- **Relaciones:** conecta dos `stations`. En el MVP: EST-001→EST-002 y EST-002→EST-003.
- **Observaciones MVP:** puede inferirse de `stations.next_station_id`, pero esta
  tabla permite enriquecer cada tramo con instrucciones y geometría sin saturar
  `stations`.

---

## 7. barrier_reports

**Propósito:** reportes de barreras de accesibilidad enviados desde una estación.
**No se implementa la funcionalidad de reportes todavía**; la tabla queda
documentada para el sprint correspondiente.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `station_id` | `uuid` FK → stations.id | Estación donde se reporta. |
| `barrier_type` | `text` not null | Tipo de barrera reportada. |
| `description` | `text` | Detalle del reporte (texto libre, sin datos personales). |
| `status` | `text` default 'pendiente' | `pendiente` / `revisado` / `resuelto`. |
| `created_at` | `timestamptz` default now() | |

- **PK:** `id`.
- **FK:** `station_id → stations.id`.
- **Relaciones:** `1 station → N barrier_reports`.
- **Observaciones MVP:** **no implementar aún**. No almacenar datos personales
  sensibles; el reporte debe ser anónimo o pseudónimo.

---

## 8. station_events

**Propósito:** registro de **activaciones anónimas** de estaciones (telemetría de
uso) para el futuro panel gestor. Permite saber qué estaciones se activan sin
identificar a la persona.

| Campo | Tipo sugerido | Notas |
|---|---|---|
| `id` | `uuid` PK | Clave primaria. |
| `station_id` | `uuid` FK → stations.id | Estación activada. |
| `event_type` | `text` not null | `activation`, `audio_play`, etc. |
| `occurred_at` | `timestamptz` default now() | Momento del evento. |
| `session_hash` | `text` nullable | Identificador **anónimo** de sesión (hash), no PII. |

- **PK:** `id`.
- **FK:** `station_id → stations.id`.
- **Relaciones:** `1 station → N station_events`.
- **Observaciones MVP:** **sin datos personales**. `session_hash` es opcional y
  anónimo (no email, no nombre, no ubicación precisa de la persona).

---

## Diagrama de relaciones (resumen)

```text
attractions 1───N stations
stations    1───N audio_guides
stations    1───N safety_points        (station_id nullable)
stations    1───N touch_resources
stations    1───N barrier_reports
stations    1───N station_events
stations    N───N stations  vía route_segments (from_station_id / to_station_id)
```

---

## Contrato actual mock vs modelo futuro Supabase

Esta sección explica la transición entre el estado actual (mock en memoria) y el
modelo relacional futuro.

### Qué datos están hoy en mock

| Dato | Archivo mock actual | Schema Pydantic |
|---|---|---|
| Estaciones | `backend/data/mock_stations.py` | `StationResponse` |
| Audioguías | `backend/data/mock_audio_guides.py` | `AudioGuideResponse` |
| Puntos de seguridad | `backend/data/mock_safety_points.py` | `SafetyPointResponse` |
| Recursos táctiles | `backend/data/mock_touch_resources.py` | `TouchResourceResponse` |
| Contexto de estación | (compuesto en ruta, no es mock) | `StationContextResponse` |

### Qué tablas reemplazarán esos mocks

| Mock actual | Tabla futura en Supabase |
|---|---|
| `mock_stations.py` | `stations` (+ `attractions` como raíz) |
| `mock_audio_guides.py` | `audio_guides` |
| `mock_safety_points.py` | `safety_points` |
| `mock_touch_resources.py` | `touch_resources` |
| — (futuro) | `route_segments`, `barrier_reports`, `station_events` |

### Qué servicios deberán cambiar al conectar Supabase

Los **servicios** son la única capa que cambia; **schemas y rutas se mantienen**
porque el contrato de datos no varía.

| Servicio | Cambio al conectar Supabase |
|---|---|
| `services/station_service.py` | Reemplazar lectura de `MOCK_STATIONS` por consultas a la tabla `stations`. |
| `services/audio_service.py` | Reemplazar `MOCK_AUDIO_GUIDES` por consultas a `audio_guides`. |
| `services/safety_service.py` | Reemplazar `MOCK_SAFETY_POINTS` por consultas a `safety_points`. |
| `services/touch_service.py` | Reemplazar `MOCK_TOUCH_RESOURCES` por consultas a `touch_resources`. |

Pasos previstos para la migración (fase posterior, **no ahora**):

1. Crear el proyecto Supabase y configurar credenciales vía `core/config.py` (.env).
2. Crear migraciones SQL con las tablas de este documento.
3. Cargar los datos mock actuales como semillas (seed) iniciales.
4. Sustituir el cuerpo de cada servicio por consultas reales manteniendo la firma.
5. Activar PostGIS y poblar campos geográficos (`geo_point`, `path_geom`).

> Mientras tanto, el backend sigue 100 % funcional con mocks y el frontend no
> nota ningún cambio de contrato.
