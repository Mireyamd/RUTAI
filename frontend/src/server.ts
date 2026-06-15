// Entry de servidor (SSR) de TanStack Start. El plugin de Vite está configurado
// para usar este archivo como punto de entrada del servidor (ver vite.config.ts).
// El export por defecto debe exponer `{ fetch }`, que es la forma que esperan
// tanto el dev server como el build de Start.
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";

const fetch = createStartHandler(defaultStreamHandler);

export default { fetch };
