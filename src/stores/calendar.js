import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", {
  state: () => {
    return {
      eventsList: [
        {
          colorGroup: "", // events groups by color id : "red" / "blue" etc.
          dot: "picked color", // "red" / "blue" etc.
          dates: [], // new Date (year, month, day)
          company: "", // the name of the company
          description: "", // event details
          participants: [] // who will be on the call
        }
      ]
    };
  },
  getters: {},
  actions: {}
});
