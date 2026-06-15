// Capa de servicio de estaciones. Encapsula los endpoints reales del backend
// (Sprint 0) y expone funciones tipadas. Los hooks y componentes usan esta capa
// en lugar de llamar a `apiClient` directamente.

import { apiClient } from "@/lib/apiClient";
import type { Station, StationContext } from "@/types/station";

export const stationApi = {
  /** GET /api/stations — lista completa de estaciones de la ruta. */
  listStations: () => apiClient.get<Station[]>("/api/stations"),

  /** GET /api/stations/by-code/{code} — estación por su código público (ej. "001"). */
  getStationByCode: (code: string) =>
    apiClient.get<Station>(`/api/stations/by-code/${encodeURIComponent(code)}`),

  /** GET /api/stations/{station_id}/context — contexto completo de una estación. */
  getStationContext: (stationId: string) =>
    apiClient.get<StationContext>(`/api/stations/${encodeURIComponent(stationId)}/context`),

  /**
   * Resuelve el contexto completo a partir del código público de la URL.
   * Primero obtiene la estación por código (para conocer su id interno) y luego
   * pide su contexto. Así la vista `/e/001` no necesita conocer el id "EST-001".
   */
  async getContextByCode(code: string): Promise<StationContext> {
    const station = await stationApi.getStationByCode(code);
    return stationApi.getStationContext(station.id);
  },
};
