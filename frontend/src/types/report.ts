// Tipos de reportes de barreras, alineados 1:1 con los esquemas del backend
// (BarrierReportCreate y BarrierReportResponse). Los reportes son anónimos:
// no incluyen ningún dato personal.

export type BarrierReportCategory =
  | "signage_missing"
  | "audio_not_working"
  | "unclear_route"
  | "needed_assistance"
  | "other";

export type BarrierReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

/** Contrato de entrada para crear un reporte anónimo. */
export interface BarrierReportCreate {
  station_id: string;
  category: BarrierReportCategory;
  description?: string;
}

/** Respuesta pública de un reporte de barrera. */
export interface BarrierReport {
  id: string;
  station_id: string;
  category: BarrierReportCategory;
  description: string | null;
  status: BarrierReportStatus;
  created_at: string;
}
