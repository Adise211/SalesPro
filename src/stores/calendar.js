import { defineStore } from "pinia";
import { initStores } from "./index";

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
              prodact: String --> the prodact for sale
              description: String, --> event description
              participants: String[] --> who will be on the call
            }
         */
      ],
      eventsGroupsAttr: [
        /**
            ** This array keeps all the events with the same event color in one group **
            ** in order to keep the data organized and easy to display**
            {
              dot: "picked color", --> "red" || "blue" etc.
              dates: [{ eventId: null, eventDate: "" }] --> list of dates with the same color
            }
         */
      ]
    };
  },
  getters: {},
  actions: {
    setUserEventsList(arr) {
      // add the new event in the events list
      this.userEventsList = arr;

      if (this.userEventsList.length > 0) {
        this.userEventsList.map((eventObj) => {
          // get event id, date and color
          const { EventId, EventDate, EventColor } = eventObj;
          // find the group by color
          const groupByColor = this.eventsGroupsAttr.find((group) => {
            return group.dot === EventColor;
          });
          if (groupByColor) {
            // if the group exist: push the event into this group
            groupByColor.dates.push({ EventId, EventDate });
          } else {
            // otherwise: cretae new group and add the event into it
            const newGroup = {
              dot: EventColor,
              dates: [{ EventId, EventDate }]
            };
            this.eventsGroupsAttr.push(newGroup);
          }
        });
      }
    },
    addEventToListInStore(data) {
      // for local changes (before updating the server)
      const { EventId, EventDate, EventColor, Company } = data;

      const isEventAlreadyExist = this.userEventsList.find((item) => {
        item.EventId === data.EventId;
      });

      if (!isEventAlreadyExist) {
        this.userEventsList.push(data);
        const groupByColor = this.eventsGroupsAttr.find((group) => {
          return group.dot === EventColor;
        });
        if (groupByColor) {
          // if the group exist: push the event into this group
          groupByColor.dates.push({ EventId, EventDate });
        } else {
          // otherwise: cretae new group and add the event into it
          const newGroup = {
            dot: EventColor,
            dates: [{ EventId, EventDate }]
          };
          this.eventsGroupsAttr.push(newGroup);
        }
      }
      // add to user's companies list
      const { generalStore } = initStores();
      generalStore.addNewCompany(Company);
    }
  },
  persist: {
    storage: localStorage
  }
});
