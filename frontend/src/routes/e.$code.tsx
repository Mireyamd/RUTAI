import { Link, createFileRoute } from "@tanstack/react-router";

import { AudioGuideBlock } from "@/components/station/AudioGuideBlock";
import { SafetyBlock } from "@/components/station/SafetyBlock";
import { TouchResourceBlock } from "@/components/station/TouchResourceBlock";
import { buttonStyles } from "@/components/ui/button-styles";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { useStationContext } from "@/hooks/useStationContext";
import { stationIdToCode } from "@/lib/utils";

export const Route = createFileRoute("/e/$code")({
  component: StationPage,
});

function StationPage() {
  const { code } = Route.useParams();
  const { data, isLoading, isError } = useStationContext(code);

  return (
    <main id="contenido" className="mx-auto max-w-2xl px-5 py-10">
      <header>
        <p className="m-0 text-lg font-bold text-accent">
          {data ? `Estación ${data.station.order} de la ruta RUTAI` : `Estación ${code}`}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">
          {data ? data.station.name : `Estación ${code}`}
        </h1>
        {data ? (
          <>
            <p className="mt-3 text-xl text-muted">{data.station.short_description}</p>
            <p className="mt-3">{data.station.long_description}</p>
          </>
        ) : null}
      </header>

      {isLoading ? (
        <div className="mt-8">
          <StatusMessage
            title={`Cargando la estación ${code}.`}
            description="Estamos preparando el audio, la seguridad y el recurso táctil. Espera un momento."
          />
        </div>
      ) : null}

      {isError ? (
        <div className="mt-8">
          <StatusMessage
            tone="error"
            title={`No pudimos cargar la estación ${code}.`}
            description="Revisa tu conexión e inténtalo de nuevo. También puedes volver al inicio para reiniciar la ruta."
          >
            <div className="mt-4">
              <Link to="/" className={buttonStyles({ variant: "secondary" })}>
                Volver al inicio
              </Link>
            </div>
          </StatusMessage>
        </div>
      ) : null}

      {data ? (
        <>
          <div className="mt-8 space-y-6">
            <AudioGuideBlock audio={data.audio} />
            <SafetyBlock points={data.safety_points} />
            <TouchResourceBlock resource={data.touch_resource} />
          </div>

          <nav aria-label="Acciones de la estación" className="mt-8 flex flex-col gap-4">
            <Link
              to="/report/$stationId"
              params={{ stationId: data.station.id }}
              className={buttonStyles({ variant: "danger" })}
            >
              Reportar barrera
            </Link>

            {data.station.next_station_id ? (
              <Link
                to="/e/$code"
                params={{ code: stationIdToCode(data.station.next_station_id) }}
                className={buttonStyles({ variant: "primary" })}
              >
                Ir a la siguiente estación
              </Link>
            ) : (
              <p className="m-0 rounded-xl bg-surface p-4 text-center text-muted">
                Has llegado a la última estación de la ruta.
              </p>
            )}

            <Link to="/" className={buttonStyles({ variant: "secondary" })}>
              Volver al inicio
            </Link>
          </nav>
        </>
      ) : null}
    </main>
  );
}
