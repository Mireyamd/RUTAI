import type { SafetyPoint } from "@/types/station";

interface SafetyBlockProps {
  points: SafetyPoint[];
}

// Etiqueta textual del nivel de cuidado. No se confía solo en el color:
// siempre se anuncia con palabras.
const SEVERITY_LABEL: Record<string, string> = {
  alta: "Cuidado alto",
  media: "Cuidado medio",
  baja: "Cuidado leve",
};

/**
 * Seguridad de la estación con prioridad. Lenguaje directo y no alarmista.
 * Si no hay puntos de seguridad, no se renderiza la sección.
 */
export function SafetyBlock({ points }: SafetyBlockProps) {
  if (points.length === 0) return null;

  return (
    <section
      aria-labelledby="seguridad-titulo"
      className="rounded-2xl border-2 border-[var(--color-danger)] bg-[var(--color-surface)] p-6"
    >
      <h2 id="seguridad-titulo" className="mt-0 text-2xl font-bold">
        Recomendación de seguridad
      </h2>
      <p className="text-[var(--color-muted)]">Zona de cuidado. Pide apoyo si lo necesitas.</p>

      <ul className="m-0 list-none space-y-4 p-0">
        {points.map((point) => (
          <li key={point.id} className="rounded-xl bg-[var(--color-surface-2)] p-4">
            <p className="m-0 font-bold">
              {SEVERITY_LABEL[point.severity] ?? "Recomendación de seguridad"}
            </p>
            <p className="mt-2 mb-0">{point.description}</p>
            <p className="mt-2 mb-0 text-[var(--color-muted)]">
              <span className="font-bold text-[var(--color-text)]">Qué hacer: </span>
              {point.recommendation}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
