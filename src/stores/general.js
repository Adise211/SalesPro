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
      userNotesList: []
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
    }
  },
  persist: [
    {
      paths: ["userId", "userLastLoggedInTime", "userFullName", "userEmail", "companiesList"],
      storage: localStorage
    },
    {
      paths: ["sessionToken"],
      storage: sessionStorage
    }
  ]
});
