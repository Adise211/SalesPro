import { defineStore } from "pinia";
import moment from "moment";
import Config from "../utilities/config";
import { convertTime } from "../utilities/utilsFuncs";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      userId: "",
      sessionToken: "",
      userLastLoggedInTime: 0,
      userFullName: "",
      userEmail: "",
      companiesList: [],
      userCalendarEventsList: [],
      userNotesList: [],
      notesWithReminder: []
    };
  },
  getters: {
    isSessionUserActive(state) {
      let currentTime = moment(new Date());
      let lastLoggedInTime = moment(state.userLastLoggedInTime);

      return (
        // how much time passed since user logged in until now in hours
        currentTime.diff(lastLoggedInTime, "hours") <
        // the limited time user could be active in the system (from second to hours)
        convertTime(Config.session.userActivityThreshold).hours
      );
    },
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
    setUserId(data) {
      this.userId = data;
    },
    setSessionToken(token) {
      this.sessionToken = token;
    },
    setUserLastLoggedInTime(time) {
      this.userLastLoggedInTime = time;
    },
    setUserFullName(fullName) {
      this.userFullName = fullName;
    },
    setUserEmail(email) {
      this.userEmail = email;
    },
    setCompaniesList(list) {
      this.companiesList = list;
    },
    addNewCompanyInStore(newCompanyObj) {
      // 1. If list is not empty
      if (this.companiesList.length > 0) {
        // Check if the company's name exist in the list
        const isCompanyExist = this.companiesList.find((com) => {
          if (com.Company === newCompanyObj.Company) return com;
        });
        // If not exist - add it
        if (!isCompanyExist) {
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
    setUserNotesList(data) {
      this.userNotesList = data;
      this.updateNotesWithReminderList();
    },
    updateUserNotesListInStore(noteData) {
      const currentNoteInList = this.userNotesList.find((note) => {
        return note.NoteId === noteData.NoteId;
      });
      // If the list is not empty and note exist in the list - replace the note
      if (this.userNotesList.length > 0 && currentNoteInList) {
        const noteIndex = this.userNotesList.indexOf(currentNoteInList);
        if (noteIndex > -1) {
          this.userNotesList.splice(noteIndex, 1, noteData);
        }
      } else {
        // Otherwise (list is empty or note doesn't exist in the list) - add the new note
        this.userNotesList.push(noteData);
      }
      this.updateNotesWithReminderList();
    },
    removeNoteFromStore(noteObj) {
      const objIndex = this.userNotesList.indexOf(noteObj);

      // only splice array when item is found
      if (objIndex > -1) {
        this.userNotesList.splice(objIndex, 1); // 2nd parameter means remove one item only
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
      paths: [
        "userId",
        "userLastLoggedInTime",
        "userFullName",
        "userEmail",
        "companiesList",
        "userNotesList",
        "notesWithReminder"
      ],
      storage: localStorage
    },
    {
      paths: ["sessionToken"],
      storage: sessionStorage
    }
  ]
});
