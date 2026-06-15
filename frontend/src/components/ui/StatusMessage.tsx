import { cn } from "@/lib/utils";

type StatusTone = "info" | "error";

interface StatusMessageProps {
  /** "info" para cargas/estados neutros, "error" para fallos. */
  tone?: StatusTone;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

/**
 * Región anunciada por el lector de pantalla (aria-live) para comunicar
 * carga, estados vacíos o errores. El texto explica qué pasa y qué hacer; no
 * depende del color porque incluye una etiqueta textual del estado.
 */
export function StatusMessage({ tone = "info", title, description, children }: StatusMessageProps) {
  const isError = tone === "error";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-xl border-2 p-5 text-base",
        isError
          ? "border-[var(--color-danger)] bg-[#3a1f1c]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
      )}
    >
      <p className="m-0 font-bold">
        <span className="mr-2">{isError ? "Error:" : "Información:"}</span>
        {title}
      </p>
      {description ? <p className="mt-2 mb-0 text-[var(--color-muted)]">{description}</p> : null}
      {children}
    </div>
  );
}
