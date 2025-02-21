import { defineStore } from "pinia";
import { Config } from "../utilities/config";
import { convertTime } from "../utilities/utilsFuncs";
import moment from "moment";

export const useSessionStore = defineStore("session", {
  state: () => {
    return {
      userId: "",
      sessionToken: "",
      userLastLoggedInTime: 0,
      userFullName: "",
      userEmail: "",
      userWorkSpace: "",
      userRole: ""
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
    setUserWorkSpace(workspace) {
      this.userWorkSpace = workspace;
    },
    setUserRole(role) {
      this.userRole = role;
    }
  },
  persist: true
});
