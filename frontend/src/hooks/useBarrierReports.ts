// Hook de datos para los reportes de barreras del panel gestor. Centraliza la
// carga vía react-query usando la capa de servicio; el componente nunca hace
// fetch directo.

import { useQuery } from "@tanstack/react-query";

import { reportApi } from "@/services/reportApi";

export function useBarrierReports() {
  return useQuery({
    queryKey: ["barrier-reports"],
    queryFn: () => reportApi.getBarrierReports(),
    staleTime: 1000 * 30,
    retry: 1,
  });
}
