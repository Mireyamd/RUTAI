import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonStyles } from "@/components/ui/button-styles";

export const Route = createFileRoute("/manager")({
  component: ManagerPage,
});

// Datos simulados solo como referencia visual del panel. No provienen del
// backend: el panel gestor es una vista prototipo para esta etapa.
const METRICS = [
  { label: "Estaciones activas", value: "3" },
  { label: "Reportes recibidos", value: "12" },
  { label: "Barreras críticas", value: "2" },
  { label: "Última revisión", value: "15 jun 2026" },
];

const SAMPLE_REPORTS = [
  { id: "R-104", station: "Estación 2 — Patrimonio sensorial", reason: "El audio no funcionó" },
  { id: "R-103", station: "Estación 3 — Seguridad y cierre", reason: "La ruta no fue clara" },
  { id: "R-102", station: "Estación 1 — Bienvenida", reason: "No encontré la señal" },
];

function ManagerPage() {
  return (
    <main id="contenido" className="mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="mt-0 text-3xl font-extrabold leading-tight">Panel gestor RUTAI</h1>
        <p className="mt-2 inline-block rounded-full bg-[var(--color-surface-2)] px-4 py-1 text-base font-bold text-[var(--color-accent)]">
          Vista prototipo
        </p>
        <p className="mt-3 text-lg text-[var(--color-muted)]">
          Resumen del estado de la ruta. Los datos mostrados son simulados para esta etapa.
        </p>
      </header>

      <section aria-labelledby="metricas-titulo" className="mt-8">
        <h2 id="metricas-titulo" className="text-2xl font-bold">
          Métricas de la ruta
        </h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {METRICS.map((metric) => (
            <li key={metric.label} className="rounded-2xl bg-[var(--color-surface)] p-6">
              <p className="m-0 text-base font-bold text-[var(--color-muted)]">{metric.label}</p>
              <p className="m-0 mt-2 text-3xl font-extrabold">{metric.value}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="reportes-titulo" className="mt-8">
        <h2 id="reportes-titulo" className="text-2xl font-bold">
          Reportes recientes
        </h2>
        <p className="text-[var(--color-muted)]">
          Lista simulada de ejemplo. Aún no está conectada a datos reales.
        </p>
        <ul className="m-0 list-none space-y-4 p-0">
          {SAMPLE_REPORTS.map((report) => (
            <li key={report.id} className="rounded-2xl bg-[var(--color-surface)] p-5">
              <p className="m-0 font-bold">{report.station}</p>
              <p className="m-0 mt-1 text-[var(--color-muted)]">Motivo: {report.reason}</p>
              <p className="m-0 mt-1 text-sm text-[var(--color-muted)]">Folio {report.id}</p>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Navegación del panel" className="mt-8">
        <Link to="/" className={buttonStyles({ variant: "secondary" })}>
          Volver al inicio
        </Link>
      </nav>
    </main>
  );
}
