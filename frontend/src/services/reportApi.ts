// Capa de servicio de reportes de barreras. Encapsula los endpoints reales del
// backend (POST/GET /api/reports) y expone funciones tipadas. Los componentes
// usan esta capa en lugar de llamar a `apiClient` directamente.
//
// Los reportes son anónimos: nunca se envían datos personales.

import { apiClient } from "@/lib/apiClient";
import type { BarrierReport, BarrierReportCategory, BarrierReportCreate } from "@/types/report";

/**
 * Opciones visibles del formulario, mapeadas a las categorías válidas del
 * backend. El orden define cómo se muestran en pantalla.
 */
export const BARRIER_OPTIONS: ReadonlyArray<{
  category: BarrierReportCategory;
  label: string;
}> = [
  { category: "signage_missing", label: "No encontré la señal" },
  { category: "audio_not_working", label: "El audio no funcionó" },
  { category: "unclear_route", label: "La ruta no fue clara" },
  { category: "needed_assistance", label: "Necesité apoyo adicional" },
  { category: "other", label: "Otro" },
];

/** Etiqueta legible (en español) de una categoría del backend. */
export function categoryLabel(category: string): string {
  return BARRIER_OPTIONS.find((option) => option.category === category)?.label ?? category;
}

export const reportApi = {
  /** POST /api/reports — crea un reporte anónimo de barrera. */
  createBarrierReport: (payload: BarrierReportCreate) =>
    apiClient.post<BarrierReport>("/api/reports", payload),

  /** GET /api/reports — lista los reportes anónimos recibidos. */
  getBarrierReports: () => apiClient.get<BarrierReport[]>("/api/reports"),
};

// Reexports nombrados para uso directo, según lo sugerido en el módulo.
export const createBarrierReport = reportApi.createBarrierReport;
export const getBarrierReports = reportApi.getBarrierReports;
