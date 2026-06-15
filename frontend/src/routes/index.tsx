import { Link, createFileRoute } from "@tanstack/react-router";

import { buttonStyles } from "@/components/ui/button-styles";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main id="contenido" className="mx-auto max-w-2xl px-5 py-10">
      <header>
        <p className="m-0 text-lg font-bold tracking-wide text-[var(--color-accent)]">RUTAI</p>
        <h1 className="mt-2 text-4xl font-extrabold leading-tight">
          Ruta sensorial accesible para turismo sin barreras
        </h1>
        <p className="mt-4 text-xl text-[var(--color-muted)]">
          Explora estaciones con audio, orientación, seguridad y recursos táctiles.
        </p>
      </header>

      <section
        aria-labelledby="para-quien"
        className="mt-8 rounded-2xl bg-[var(--color-surface)] p-6"
      >
        <h2 id="para-quien" className="mt-0 text-2xl font-bold">
          Pensada para ti
        </h2>
        <p className="m-0 text-[var(--color-muted)]">
          RUTAI acompaña a personas con discapacidad visual o baja visión durante una ruta
          turística. Cada acción se entiende solo escuchándola. No prometemos independencia total:
          buscamos aumentar tu autonomía, seguridad y orientación durante el recorrido.
        </p>
      </section>

      <nav aria-label="Acciones principales" className="mt-8 flex flex-col gap-4">
        <Link
          to="/e/$code"
          params={{ code: "001" }}
          className={buttonStyles({ variant: "primary" })}
        >
          Iniciar ruta
        </Link>
        <Link
          to="/e/$code"
          params={{ code: "001" }}
          className={buttonStyles({ variant: "secondary" })}
        >
          Ir a estación 1
        </Link>
        <Link to="/manager" className={buttonStyles({ variant: "secondary" })}>
          Panel gestor
        </Link>
      </nav>
    </main>
  );
}
