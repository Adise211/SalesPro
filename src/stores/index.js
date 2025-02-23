import { useSessionStore } from "./session";
import { useGeneralStore } from "./general";

// Using a pinia store outside of a Vue component

function initStores() {
  const generalStore = useGeneralStore();
  const sessionStore = useSessionStore();

  return { generalStore, sessionStore };
}

export { initStores };
