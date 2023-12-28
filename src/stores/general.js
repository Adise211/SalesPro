import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      userId: "",
      sessionToken: "",
      userFullName: "",
      userEmail: "",
      companiesList: []
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
    }
  },
  persist: [
    {
      paths: ["userId", "userFullName", "userEmail", "companiesList"],
      storage: localStorage
    },
    {
      paths: ["sessionToken"],
      storage: sessionStorage
    }
  ]
});
