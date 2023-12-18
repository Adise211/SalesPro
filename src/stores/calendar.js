import { defineStore } from "pinia";

export const useCalendarStore = defineStore("calendar", {
  state: () => {
    return {
      eventsList: [
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
    createNewEvent(data) {
      // 1. generates random id
      const rendonId = Math.floor(Math.random() * 1000);
      // 2. the new event object
      const newEventObj = {
        eventId: rendonId,
        eventDate: data.date,
        eventColor: data.color,
        company: data.company,
        description: data.description,
        participants: data.participants
      };
      // 3. add the new event in the events list
      this.eventsList.push(newEventObj);

      // 4. find the group by color
      const groupByColor = this.eventsAttrGropus.find((group) => {
        return group.groupColor === data.color;
      });

      if (groupByColor) {
        // 5.1 if the group exist: add the new event in the group
        groupByColor.dates.push({ eventId: newEventObj.eventId, eventDate: newEventObj.eventDate });
      } else {
        // 5.2 if the group is NOT exist: create new group + add the new event
        const newGroup = {
          groupColor: data.color,
          dot: data.color,
          dates: [{ eventId: newEventObj.eventId, eventDate: newEventObj.eventDate }]
        };
        this.eventsAttrGropus.push(newGroup);
      }
    }
  }
});
