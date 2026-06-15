import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper estándar para componer clases de Tailwind de forma segura.
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Convierte el id interno de una estación (ej. "EST-002") en su código público
 * de ruta (ej. "002"), usado en las URL `/e/002`. Refleja el contrato del
 * backend, donde `code` es el sufijo numérico del `id`.
 */
export function stationIdToCode(stationId: string): string {
  return stationId.replace(/^EST-/i, "");
}
