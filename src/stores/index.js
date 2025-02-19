import { useSessionStore } from "./session";
import { useCalendarStore } from "./calendar";
import { useGeneralStore } from "./general";

// Using a pinia store outside of a Vue component

function initStores() {
  const generalStore = useGeneralStore();
  const calendarStore = useCalendarStore();
  const sessionStore = useSessionStore();

  return { generalStore, calendarStore, sessionStore };
}

export { initStores };
