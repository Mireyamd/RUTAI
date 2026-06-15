// Tipos del frontend alineados 1:1 con los esquemas del backend (Sprint 0).
// No se inventan campos: reflejan StationResponse, AudioGuideResponse,
// SafetyPointResponse, TouchResourceResponse y StationContextResponse.

export interface Station {
  id: string;
  code: string;
  name: string;
  type: string;
  order: number;
  short_description: string;
  long_description: string;
  audio_url: string;
  next_station_id: string | null;
}

export interface AudioGuide {
  id: string;
  station_id: string;
  audio_type: string;
  url: string;
  transcript: string;
  duration_seconds: number | null;
  language: string;
}

export interface SafetyPoint {
  id: string;
  station_id: string;
  type: string;
  severity: string;
  description: string;
  recommendation: string;
  validated_by: string | null;
}

export interface TouchResource {
  id: string;
  station_id: string;
  name: string;
  type: string;
  touch_allowed: boolean;
  instruction: string;
  restriction: string | null;
  material: string | null;
}

export interface StationContext {
  station: Station;
  audio: AudioGuide | null;
  safety_points: SafetyPoint[];
  touch_resource: TouchResource | null;
}
