import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonStyles } from "@/components/ui/button-styles";
import { StatusMessage } from "@/components/ui/StatusMessage";

export const Route = createFileRoute("/report/$stationId")({
  component: ReportPage,
});

const QUICK_OPTIONS = [
  "No encontré la señal",
  "El audio no funcionó",
  "La ruta no fue clara",
  "Necesité apoyo adicional",
];

function ReportPage() {
  const { stationId } = Route.useParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent] = useState(false);

  function toggle(option: string) {
    setSent(false);
    setSelected((current) =>
      current.includes(option) ? current.filter((item) => item !== option) : [...current, option],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Prototipo: el reporte aún no se envía a ningún servidor. No se piden ni
    // se guardan datos personales.
    setSent(true);
  }

  return (
    <main id="contenido" className="mx-auto max-w-2xl px-5 py-10">
      <header>
        <p className="m-0 text-lg font-bold text-[var(--color-accent)]">
          Reporte de la estación {stationId}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">Reportar una barrera</h1>
        <p className="mt-3 text-xl text-[var(--color-muted)]">
          Cuéntanos qué dificultó tu experiencia. No pedimos tu nombre ni datos personales. Elige
          una o varias opciones y envía el reporte.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8">
        <fieldset className="m-0 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <legend className="px-2 text-xl font-bold">¿Qué ocurrió?</legend>
          <ul className="m-0 list-none space-y-3 p-0">
            {QUICK_OPTIONS.map((option) => (
              <li key={option}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-[var(--color-surface-2)] p-4 text-lg">
                  <input
                    type="checkbox"
                    name="motivo"
                    value={option}
                    checked={selected.includes(option)}
                    onChange={() => toggle(option)}
                    className="h-6 w-6 flex-shrink-0"
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="mt-6 flex flex-col gap-4">
          <button type="submit" className={buttonStyles({ variant: "primary" })}>
            Enviar reporte
          </button>
          <Link to="/" className={buttonStyles({ variant: "secondary" })}>
            Volver al inicio
          </Link>
        </div>
      </form>

      <div className="mt-6" aria-live="polite">
        {sent ? (
          <StatusMessage
            title="Reporte registrado. Gracias por ayudarnos a mejorar la ruta."
            description={
              selected.length > 0
                ? `Anotamos ${selected.length} ${selected.length === 1 ? "motivo" : "motivos"}. Este es un prototipo: el reporte todavía no se envía a un servidor.`
                : "No elegiste ningún motivo. Este es un prototipo: el reporte todavía no se envía a un servidor."
            }
          />
        ) : null}
      </div>
    </main>
  );
}
