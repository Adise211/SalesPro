import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", {
  state: () => {
    return {
      userEventsList: [
        /**
            {
              eventId: null,
              eventDate: null, --> new Date (year, month, day)
              eventColor: String, --> "red" || "blue" etc.
              company: String, --> the name of the company
              description: String, --> event description
              participants: String[] --> who will be on the call
            }
         */
      ],
      eventsAttrGropus: [
        /**
            ** This array keeps all the events with the same event color in one group **
            ** in order to keep the data organized **
            {
              groupColor: String, --> events groups by color id : "red" / "blue" etc.
              dot: "picked color", --> "red" || "blue" etc.
              dates: [{ eventId: null, eventDate: "" }] --> list of dates with the same color
            }
         */
      ]
    };
  },
  getters: {},
  actions: {
    setUserEventsList(data) {
      // add the new event in the events list
      this.userEventsList = data;

      if (this.userEventsList.length > 0) {
        this.userEventsList.map((eventObj) => {
          // get event id, date and color
          const { EventId, EventDate, EventColor } = eventObj;
          // find the group by color
          const groupByColor = this.eventsAttrGropus.find((group) => {
            return group.groupColor === EventColor;
          });
          if (groupByColor) {
            // if the group exist: push the event into this group
            groupByColor.dates.push({ EventId, EventDate });
          } else {
            // otherwise: cretae new group and add the event into it
            const newGroup = {
              groupColor: EventColor,
              dot: EventColor,
              dates: [{ EventId, EventDate }]
            };
            this.eventsAttrGropus.push(newGroup);
          }
        });
      }
    }
  }
});
