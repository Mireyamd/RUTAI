import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import { buttonStyles } from "@/components/ui/button-styles";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { ApiError } from "@/lib/apiClient";
import { BARRIER_OPTIONS, reportApi } from "@/services/reportApi";
import type { BarrierReport, BarrierReportCategory } from "@/types/report";

export const Route = createFileRoute("/report/$stationId")({
  component: ReportPage,
});

function ReportPage() {
  const { stationId } = Route.useParams();
  const [category, setCategory] = useState<BarrierReportCategory | null>(null);
  const [description, setDescription] = useState("");

  const mutation = useMutation<BarrierReport, Error, BarrierReportCategory>({
    mutationFn: (selectedCategory) => {
      const trimmed = description.trim();
      return reportApi.createBarrierReport({
        station_id: stationId,
        category: selectedCategory,
        ...(trimmed ? { description: trimmed } : {}),
      });
    },
    onSuccess: () => {
      // Solo limpiamos la selección cuando el backend confirma el éxito.
      setCategory(null);
      setDescription("");
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (category === null) return;
    mutation.mutate(category);
  }

  function errorDescription(error: Error): string {
    if (error instanceof ApiError && error.status === 0) {
      return "No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.";
    }
    return "No pudimos registrar tu reporte en este momento. Inténtalo de nuevo en unos segundos.";
  }

  return (
    <main id="contenido" className="mx-auto max-w-2xl px-5 py-10">
      <header>
        <p className="m-0 text-lg font-bold text-accent">Reporte de la estación {stationId}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">Reportar una barrera</h1>
        <p className="mt-3 text-xl text-muted">
          Cuéntanos qué dificultó tu experiencia. No pedimos tu nombre ni datos personales. Elige un
          motivo y envía el reporte.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-8">
        <fieldset className="m-0 rounded-2xl border-2 border-border bg-surface p-6">
          <legend className="px-2 text-xl font-bold">¿Qué ocurrió?</legend>
          <ul className="m-0 list-none space-y-3 p-0">
            {BARRIER_OPTIONS.map((option) => (
              <li key={option.category}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface-2 p-4 text-lg">
                  <input
                    type="radio"
                    name="motivo"
                    value={option.category}
                    checked={category === option.category}
                    onChange={() => setCategory(option.category)}
                    className="h-6 w-6 flex-shrink-0"
                  />
                  <span>{option.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className="mt-6 rounded-2xl border-2 border-border bg-surface p-6">
          <label htmlFor="descripcion" className="block text-xl font-bold">
            Detalle adicional (opcional)
          </label>
          <p className="mt-2 mb-3 text-base text-muted">
            Si quieres, describe lo que pasó. No incluyas tu nombre ni datos personales.
          </p>
          <textarea
            id="descripcion"
            name="descripcion"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            rows={4}
            className="w-full rounded-xl border-2 border-border bg-surface-2 p-4 text-lg"
          />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <button
            type="submit"
            disabled={category === null || mutation.isPending}
            aria-disabled={category === null || mutation.isPending}
            className={`${buttonStyles({ variant: "primary" })} disabled:opacity-60`}
          >
            {mutation.isPending ? "Enviando reporte…" : "Enviar reporte"}
          </button>
          <Link to="/" className={buttonStyles({ variant: "secondary" })}>
            Volver al inicio
          </Link>
        </div>
      </form>

      <div className="mt-6" aria-live="polite">
        {mutation.isPending ? (
          <StatusMessage
            title="Enviando tu reporte…"
            description="Estamos registrando tu reporte. Esto toma solo un momento."
          />
        ) : null}

        {mutation.isSuccess ? (
          <StatusMessage
            title="Reporte enviado. Gracias por ayudarnos a mejorar la ruta."
            description="Tu reporte anónimo quedó registrado. El equipo gestor podrá revisarlo."
          />
        ) : null}

        {mutation.isError ? (
          <StatusMessage
            tone="error"
            title="No se pudo enviar el reporte."
            description={errorDescription(mutation.error)}
          />
        ) : null}
      </div>
    </main>
  );
}
