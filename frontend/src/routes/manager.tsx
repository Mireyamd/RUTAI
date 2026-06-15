import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonStyles } from "@/components/ui/button-styles";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useBarrierReports } from "@/hooks/useBarrierReports";
import { categoryLabel } from "@/services/reportApi";
import type { BarrierReport } from "@/types/report";

export const Route = createFileRoute("/manager")({
  component: ManagerPage,
});

// Métricas simuladas solo como referencia visual del panel. No provienen del
// backend: se mantienen como "Vista prototipo" mientras no haya datos reales.
const SIMULATED_METRICS = [
  { label: "Estaciones activas", value: "3" },
  { label: "Barreras críticas", value: "2" },
  { label: "Última revisión", value: "15 jun 2026" },
];

function countByCategory(reports: BarrierReport[]): Array<{ label: string; value: number }> {
  const counts = new Map<string, number>();
  for (const report of reports) {
    counts.set(report.category, (counts.get(report.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, value]) => ({ label: categoryLabel(category), value }))
    .sort((a, b) => b.value - a.value);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ManagerPage() {
  const { data: reports, isLoading, isError } = useBarrierReports();
  const total = reports?.length ?? 0;
  const byCategory = reports ? countByCategory(reports) : [];

  return (
    <main id="contenido" className="mx-auto max-w-3xl px-5 py-10">
      <header>
        <h1 className="mt-0 text-3xl font-extrabold leading-tight">Panel gestor RUTAI</h1>
        <p className="mt-2 inline-block rounded-full bg-[var(--color-surface-2)] px-4 py-1 text-base font-bold text-[var(--color-accent)]">
          Vista prototipo
        </p>
        <p className="mt-3 text-lg text-[var(--color-muted)]">
          Resumen del estado de la ruta. Los reportes provienen del backend; algunas métricas
          generales aún son simuladas.
        </p>
      </header>

      <section aria-labelledby="reportes-titulo" className="mt-8">
        <h2 id="reportes-titulo" className="text-2xl font-bold">
          Reportes recibidos
        </h2>

        <div aria-live="polite">
          {isLoading ? (
            <div className="mt-3">
              <StatusMessage
                title="Cargando reportes…"
                description="Estamos consultando los reportes registrados en el servidor."
              />
            </div>
          ) : null}

          {isError ? (
            <div className="mt-3">
              <StatusMessage
                tone="error"
                title="No se pudieron cargar los reportes."
                description="No pudimos conectar con el servidor de RUTAI. Revisa que el backend esté activo e inténtalo de nuevo."
              />
            </div>
          ) : null}
        </div>

        {reports ? (
          <>
            <ul className="m-0 mt-4 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
              <li className="rounded-2xl bg-[var(--color-surface)] p-6">
                <p className="m-0 text-base font-bold text-[var(--color-muted)]">
                  Total de reportes
                </p>
                <p className="m-0 mt-2 text-3xl font-extrabold">{total}</p>
              </li>
              {byCategory.map((item) => (
                <li key={item.label} className="rounded-2xl bg-[var(--color-surface)] p-6">
                  <p className="m-0 text-base font-bold text-[var(--color-muted)]">{item.label}</p>
                  <p className="m-0 mt-2 text-3xl font-extrabold">{item.value}</p>
                </li>
              ))}
            </ul>

            {total === 0 ? (
              <p className="mt-4 text-lg text-[var(--color-muted)]">
                Aún no hay reportes registrados. Cuando alguien envíe un reporte, aparecerá aquí.
              </p>
            ) : (
              <ul className="m-0 mt-6 list-none space-y-4 p-0">
                {reports.map((report) => (
                  <li key={report.id} className="rounded-2xl bg-[var(--color-surface)] p-5">
                    <p className="m-0 font-bold">Estación {report.station_id}</p>
                    <p className="m-0 mt-1 text-[var(--color-muted)]">
                      Motivo: {categoryLabel(report.category)}
                    </p>
                    {report.description ? (
                      <p className="m-0 mt-1 text-[var(--color-muted)]">
                        Detalle: {report.description}
                      </p>
                    ) : null}
                    <p className="m-0 mt-1 text-sm text-[var(--color-muted)]">
                      Folio {report.id} · {formatDate(report.created_at)} · Estado: {report.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </section>

      <section aria-labelledby="metricas-titulo" className="mt-10">
        <h2 id="metricas-titulo" className="text-2xl font-bold">
          Métricas de la ruta
        </h2>
        <p className="text-[var(--color-muted)]">
          Datos simulados para esta etapa (vista prototipo).
        </p>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {SIMULATED_METRICS.map((metric) => (
            <li key={metric.label} className="rounded-2xl bg-[var(--color-surface)] p-6">
              <p className="m-0 text-base font-bold text-[var(--color-muted)]">{metric.label}</p>
              <p className="m-0 mt-2 text-3xl font-extrabold">{metric.value}</p>
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
