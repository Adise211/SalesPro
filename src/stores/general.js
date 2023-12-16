import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      userId: "",
      sessionToken: "",
      userFullName: ""
    };
  },
  getters: {},
  actions: {
    setUserId(data) {
      this.userId = data;
    },
    setSessionToken(token) {
      this.sessionToken = token;
    },
    setUserFullName(fullName) {
      this.userFullName = fullName;
    }
  }
});
