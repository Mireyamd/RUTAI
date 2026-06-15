import type { TouchResource } from "@/types/station";

interface TouchResourceBlockProps {
  resource: TouchResource | null;
}

/**
 * Recurso táctil de la estación, usando solo el contrato real. No renderiza
 * secciones vacías: restricción y material solo aparecen si existen.
 */
export function TouchResourceBlock({ resource }: TouchResourceBlockProps) {
  if (!resource) return null;

  return (
    <section aria-labelledby="tactil-titulo" className="rounded-2xl bg-[var(--color-surface)] p-6">
      <h2 id="tactil-titulo" className="mt-0 text-2xl font-bold">
        Recurso táctil disponible
      </h2>

      <p className="font-bold">{resource.name}</p>

      <p className="m-0">
        {resource.touch_allowed
          ? "Puedes explorar este recurso táctil."
          : "No toques la pieza original."}
      </p>

      <dl className="mt-4 space-y-3">
        <div>
          <dt className="font-bold">Instrucción</dt>
          <dd className="m-0 text-[var(--color-muted)]">{resource.instruction}</dd>
        </div>

        {resource.restriction ? (
          <div>
            <dt className="font-bold">Restricción</dt>
            <dd className="m-0 text-[var(--color-muted)]">{resource.restriction}</dd>
          </div>
        ) : null}

        {resource.material ? (
          <div>
            <dt className="font-bold">Material</dt>
            <dd className="m-0 text-[var(--color-muted)]">{resource.material}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
