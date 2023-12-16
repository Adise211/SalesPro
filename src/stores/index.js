import { useCalendarStore } from "./calendar";
import { useGeneralStore } from "./general";

// Using a pinia store outside of a Vue component

function initStores() {
  const generalStore = useGeneralStore();
  const calendarStore = useCalendarStore();

  return { generalStore, calendarStore };
}

export { initStores };
