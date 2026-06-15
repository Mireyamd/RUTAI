// Cliente HTTP central de RUTAI. Todas las llamadas al backend pasan por aquí;
// los componentes nunca hacen fetch directo. La URL base se lee de la variable
// de entorno VITE_API_BASE_URL (ver .env.example).

const RAW_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8001";

// Normaliza la base quitando una posible barra final.
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function get<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor de RUTAI.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, `La petición a ${path} falló (${response.status}).`);
  }

  return (await response.json()) as T;
}

/**
 * Construye la URL absoluta de un recurso multimedia servido por el backend
 * (por ejemplo el audio guía, cuyo `url` llega como ruta relativa).
 */
export function mediaUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export const apiClient = {
  baseUrl: API_BASE_URL,
  get,
};
