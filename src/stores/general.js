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
      console.log("store token:", token);
      this.sessionToken = token;
    },
    setUserFullName(fullName) {
      console.log("store token:", fullName);
      this.userFullName = fullName;
    }
  },
  persist: [
    {
      paths: ["userId", "userFullName"],
      storage: localStorage
    },
    {
      paths: ["sessionToken"],
      storage: sessionStorage
    }
  ]
});
