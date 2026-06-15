-- RUTAI Sprint 1 database preparation
-- PostgreSQL/Supabase initial schema proposal.
-- Documentation only: do not execute automatically in Sprint 1.

create extension if not exists pgcrypto;

create table if not exists stations (
    id text primary key,
    code text not null unique,
    name text not null,
    type text not null,
    display_order integer not null,
    short_description text not null,
    long_description text not null,
    audio_url text,
    next_station_id text references stations(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint stations_code_not_blank check (length(trim(code)) > 0),
    constraint stations_name_not_blank check (length(trim(name)) > 0),
    constraint stations_display_order_positive check (display_order > 0)
);

create table if not exists audio_guides (
    id text primary key,
    station_id text not null references stations(id) on delete cascade,
    audio_type text not null,
    url text not null,
    transcript text not null,
    duration_seconds integer,
    language text not null default 'es',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint audio_guides_station_unique unique (station_id),
    constraint audio_guides_duration_non_negative
        check (duration_seconds is null or duration_seconds >= 0),
    constraint audio_guides_language_not_blank check (length(trim(language)) > 0)
);

create table if not exists safety_points (
    id text primary key,
    station_id text not null references stations(id) on delete cascade,
    type text not null,
    severity text not null,
    description text not null,
    recommendation text not null,
    validated_by text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint safety_points_severity_allowed
        check (severity in ('baja', 'media', 'alta', 'critica'))
);

create table if not exists touch_resources (
    id text primary key,
    station_id text not null references stations(id) on delete cascade,
    name text not null,
    type text not null,
    touch_allowed boolean not null default false,
    instruction text not null,
    restriction text,
    material text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint touch_resources_station_unique unique (station_id),
    constraint touch_resources_name_not_blank check (length(trim(name)) > 0)
);

create table if not exists barrier_reports (
    id uuid primary key default gen_random_uuid(),
    station_id text not null references stations(id) on delete restrict,
    category text not null,
    description text,
    status text not null default 'open',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint barrier_reports_category_allowed check (
        category in (
            'signage_missing',
            'audio_not_working',
            'unclear_route',
            'needed_assistance',
            'other'
        )
    ),
    constraint barrier_reports_status_allowed check (
        status in ('open', 'reviewing', 'resolved', 'dismissed')
    ),
    constraint barrier_reports_description_length check (
        description is null or length(description) <= 1000
    )
);

-- Useful lookup and ordering indexes.
create index if not exists idx_stations_code on stations(code);
create index if not exists idx_stations_display_order on stations(display_order);

create index if not exists idx_audio_guides_station_id
    on audio_guides(station_id);

create index if not exists idx_safety_points_station_id
    on safety_points(station_id);

create index if not exists idx_touch_resources_station_id
    on touch_resources(station_id);

create index if not exists idx_barrier_reports_station_id
    on barrier_reports(station_id);

create index if not exists idx_barrier_reports_created_at
    on barrier_reports(created_at desc);

create index if not exists idx_barrier_reports_status_created_at
    on barrier_reports(status, created_at desc);

-- Personal data intentionally not modeled in barrier_reports:
-- no name, DNI/document number, email, phone, visitor address, visitor precise
-- location, health data, or device identifiers.
