# RUTAI — Preparación del Sprint 1

> Este documento **solo prepara** el siguiente sprint. **No** implementa Sprint 1,
> **no** crea migraciones y **no** conecta Supabase. Es una guía de planificación.

---

## 1. Punto de partida

El Sprint 0 dejó el backend FastAPI funcionando con datos mock, contrato de datos
estable (schemas Pydantic), servicios separados por dominio y 11 pruebas
automatizadas. Ver `docs/sprint_0_backend_cierre.md` y
`docs/modelo_datos_sprint_0.md`.

## 2. Decisión de enfoque del Sprint 1

El Sprint 1 debería enfocarse en **una** de estas rutas, según decisión del equipo:

### Opción A — Conectar frontend PWA con backend
Integrar la PWA (React + Vite) consumiendo los endpoints actuales (que hoy sirven
mocks). Ventaja: flujo visible de punta a punta rápido. Desventaja: los datos
siguen siendo mock.

### Opción B — Conectar Supabase/PostgreSQL y migrar mocks a base de datos
Crear tablas base, cargar seeds y reemplazar los servicios mock por repositorios
reales. Ventaja: datos persistentes y reales. Desventaja: aún sin UI conectada.

### Recomendación para nuestro equipo backend
1. **Primero** conectar Supabase/PostgreSQL con tablas base y seeds (Opción B).
2. **Luego** conectar el frontend (Opción A).

Motivo: somos frente backend/base de datos; tener datos persistentes y el contrato
respaldado por tablas reales hace que la posterior integración del frontend sea
directa y sin retrabajo.

## 3. Posibles tareas del Sprint 1

Sujetas a la decisión anterior. Si se sigue la recomendación (Opción B primero):

- [ ] Crear **migraciones SQL** con las tablas de `docs/modelo_datos_sprint_0.md`
      (`attractions`, `stations`, `audio_guides`, `safety_points`,
      `touch_resources`, y opcionalmente `route_segments`, `barrier_reports`,
      `station_events`).
- [ ] Crear **seed de estaciones** (EST-001, EST-002, EST-003) desde el mock actual.
- [ ] Crear **seed de `audio_guides`** (AUD-001..AUD-003).
- [ ] Crear **seed de `safety_points`** (SEG-001, SEG-002).
- [ ] Crear **seed de `touch_resources`** (TAC-001).
- [ ] Configurar variables `SUPABASE_URL` y `SUPABASE_KEY` (ya previstas en
      `core/config.py` y `.env.example`).
- [ ] **Reemplazar los servicios mock por repositorios Supabase manteniendo las
      mismas firmas** (`get_all_stations`, `get_station_by_id`,
      `get_station_by_code`, `get_audio_by_station_id`,
      `get_safety_points_by_station_id`, `get_touch_resource_by_station_id`).
- [ ] **Conservar los tests** actuales; deben seguir pasando contra la nueva capa
      (mock de datos o base de pruebas).

## 4. Principio clave de migración

Schemas y rutas **no cambian**. Solo cambia el **cuerpo de los servicios**: de leer
listas mock a consultar Supabase. Si las firmas se mantienen, los endpoints y las
pruebas no se rompen.

## 5. Fuera de alcance del Sprint 1 (salvo decisión explícita)

- IA / asistente con RAG.
- Reportes reales de barreras (`barrier_reports`).
- Telemetría de uso (`station_events`).
- Geometrías PostGIS.
- Autenticación / panel gestor.
