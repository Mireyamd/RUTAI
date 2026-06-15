// Entry de cliente de TanStack Start: hidrata el documento renderizado en SSR.
import { StartClient } from "@tanstack/react-start/client";
import { hydrateRoot } from "react-dom/client";

hydrateRoot(document, <StartClient />);
