import { Link } from "@tanstack/react-router";

import { buttonStyles } from "@/components/ui/button-styles";

/** Pantalla accesible para direcciones inexistentes. */
export function NotFound() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mt-0 text-3xl font-extrabold leading-tight">Página no encontrada</h1>
      <p className="mt-3 text-xl text-[var(--color-muted)]">
        La dirección que intentas abrir no existe en RUTAI. Vuelve al inicio para empezar la ruta.
      </p>
      <nav aria-label="Navegación" className="mt-8">
        <Link to="/" className={buttonStyles({ variant: "primary" })}>
          Volver al inicio
        </Link>
      </nav>
    </main>
  );
}
