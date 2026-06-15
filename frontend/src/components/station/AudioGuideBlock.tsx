import { mediaUrl } from "@/lib/apiClient";
import { StatusMessage } from "@/components/ui/StatusMessage";
import type { AudioGuide } from "@/types/station";

interface AudioGuideBlockProps {
  audio: AudioGuide | null;
}

/**
 * Bloque central de audio guía. Si no hay audio, lo comunica con un mensaje
 * claro. Nunca inventa una pista: usa la url y la transcripción reales.
 */
export function AudioGuideBlock({ audio }: AudioGuideBlockProps) {
  return (
    <section aria-labelledby="audio-titulo" className="rounded-2xl bg-surface p-6">
      <h2 id="audio-titulo" className="mt-0 text-2xl font-bold">
        Audio guía
      </h2>

      {audio ? (
        <>
          <p className="text-muted">Escucha la orientación de esta estación.</p>
          <audio
            controls
            preload="none"
            src={mediaUrl(audio.url)}
            className="mt-2 w-full"
            aria-label="Reproductor del audio guía de la estación"
          >
            Tu navegador no puede reproducir el audio. Puedes leer la transcripción más abajo.
          </audio>

          <details className="mt-4">
            <summary className="cursor-pointer text-lg font-bold">
              Leer transcripción del audio guía
            </summary>
            <p className="mt-2 text-muted">{audio.transcript}</p>
          </details>
        </>
      ) : (
        <StatusMessage
          title="Esta estación todavía no tiene audio guía disponible."
          description="Puedes continuar con la información escrita de la estación y avanzar cuando estés listo."
        />
      )}
    </section>
  );
}
