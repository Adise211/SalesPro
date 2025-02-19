import { defineStore } from "pinia";
import moment from "moment";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      companiesList: [],
      calendarEvents: [],
      userNotesList: [],
      notesWithReminder: [],
      toastMessage: {
        type: "",
        message: ""
      }
    };
  },
  getters: {
    noteReminder(state) {
      // Current time
      const now = moment(new Date());

      // Find notes with reminder for the next 48 hours
      const relevantNotes = state.notesWithReminder.filter((note) => {
        const noteTime = moment(new Date(`${note.SelectedDate} ${note.SelectedTime}`));

        const daysDiff = noteTime.diff(now, "hours");
        // console.log("notes diff:", daysDiff, note.RemindMe, 0 < daysDiff, daysDiff <= 4, note);
        if (0 < daysDiff && daysDiff <= 48 && !note.WatchedAt) {
          return note;
        }
      });
      const soretedNotes = relevantNotes.sort((a, b) => {
        const noteA = new Date(`${a.SelectedDate} ${a.SelectedTime}`);
        const noteB = new Date(`${b.SelectedDate} ${b.SelectedTime}`);
        if (noteA > noteB) {
          return 1;
        } else {
          return -1;
        }
      });
      // Take allways the first index
      return soretedNotes[0];
    }
  },
  actions: {
    setCompaniesList(list) {
      this.companiesList = list;
    },
    setCalendarEvents(list) {
      this.calendarEvents = list;
    },
    setUserNotesList(data) {
      this.userNotesList = data;
      this.updateNotesWithReminderList();
    },
    setToastMessage(data) {
      const { type, message } = data;
      this.toastMessage.type = type;
      this.toastMessage.message = message;
    },
    resetToastMessage() {
      this.toastMessage.type = "";
      this.toastMessage.message = "";
    },
    addCalendarEventToStore(eventData) {
      this.calendarEvents.push(eventData);
    },
    removeCalendarEventFromStore(eventData) {
      const objIndex = this.calendarEvents.indexOf(eventData);
      // only splice array when item is found
      if (objIndex > -1) {
        this.calendarEvents.splice(objIndex, 1);
      }
    },
    updateCalendarEventInStore(eventData) {
      const isEventInList = this.calendarEvents.find((item) => {
        return item.id === eventData.id;
      });
      if (isEventInList && this.calendarEvents.length > 0) {
        const currentEventIndex = this.calendarEvents.indexOf(isEventInList);
        if (currentEventIndex > -1) {
          this.calendarEvents.splice(currentEventIndex, 1, eventData);
        }
      }
    },
    updateCompaniesListInStore(newCompanyObj) {
      // 1. If list is not empty + company has an id
      console.log("store:", newCompanyObj);
      if (this.companiesList.length > 0 && newCompanyObj.companyId) {
        // Check if company exist in the list (return index)
        const companyIndex = this.companiesList.findIndex(
          (com) => com.companyId === newCompanyObj.companyId
        );
        // If exist - replace it! (with the updated company object)
        if (companyIndex > -1) {
          console.log("found company index!", companyIndex);
          this.companiesList.splice(companyIndex, 1, newCompanyObj);
        } else {
          // If not exist - add it
          this.companiesList.push(newCompanyObj);
        }
      } else {
        // 2. If the list is empty - add it
        this.companiesList.push(newCompanyObj);
      }
    },
    removeCompanyFromStore(companyObj) {
      const objIndex = this.companiesList.indexOf(companyObj);

      // only splice array when item is found
      if (objIndex > -1) {
        this.companiesList.splice(objIndex, 1); // 2nd parameter means remove one item only
      }
    },
    addEventToStore(noteData) {
      this.userNotesList.push(noteData);
    },
    updateUserNotesListInStore(noteData) {
      const currentNoteInList = this.userNotesList.find((note) => {
        return note.noteId === noteData.noteId;
      });
      // If the note exist in the list - replace the note
      if (currentNoteInList) {
        const noteIndex = this.userNotesList.indexOf(currentNoteInList);
        if (noteIndex > -1) {
          this.userNotesList.splice(noteIndex, 1, noteData);
        }
      }
      this.updateNotesWithReminderList();
    },
    removeNoteFromStore(noteObj) {
      const noteIndex = this.userNotesList.indexOf(noteObj);

      // only splice array when item is found
      if (noteIndex > -1) {
        this.userNotesList.splice(noteIndex, 1); // 2nd parameter means remove one item only
      }
      this.updateNotesWithReminderList();
    },
    updateNotesWithReminderList() {
      // Reset
      this.notesWithReminder = [];
      const updatedList = this.userNotesList.filter((note) => {
        if (note.RemindMe) {
          return note;
        }
      });
      // Updated list
      this.notesWithReminder = updatedList;
    }
  },
  persist: [
    {
      paths: ["companiesList", "userNotesList", "notesWithReminder", "calendarEvents"],
      storage: localStorage
    }
    // {
    //   paths: ["sessionToken"],
    //   storage: sessionStorage
    // }
  ]
});
