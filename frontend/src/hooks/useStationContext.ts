// Hook de datos para una estación. Centraliza la carga del contexto (estación,
// audio, seguridad y recurso táctil) vía react-query. Los componentes consumen
// este hook y nunca hacen fetch directo.
//
// Las opciones de query se exponen aparte (`stationContextQueryOptions`) para
// que el loader de la ruta pueda precargarlas en el servidor (SSR) usando la
// misma clave de caché que el hook.

import { queryOptions, useQuery } from "@tanstack/react-query";

import { stationApi } from "@/services/stationApi";

export function stationContextQueryOptions(code: string) {
  return queryOptions({
    queryKey: ["station-context", code],
    queryFn: () => stationApi.getContextByCode(code),
    staleTime: 1000 * 60 * 5,
  });
}

export function useStationContext(code: string) {
  return useQuery({
    ...stationContextQueryOptions(code),
    enabled: Boolean(code),
    retry: 1,
  });
}
