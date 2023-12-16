import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      userId: "",
      sessionToken: "",
      userFullName: "",
      userEmail: ""
    };
  },
  getters: {},
  actions: {
    setUserId(data) {
      this.userId = data;
    },
    setSessionToken(token) {
      console.log("store token:", token);
      this.sessionToken = token;
    },
    setUserFullName(fullName) {
      console.log("store fullName:", fullName);
      this.userFullName = fullName;
    },
    setUserEmail(email) {
      console.log("store fullName:", email);
      this.userEmail = email;
    }
  },
  persist: [
    {
      paths: ["userId", "userFullName", "userEmail"],
      storage: localStorage
    },
    {
      paths: ["sessionToken"],
      storage: sessionStorage
    }
  ]
});
