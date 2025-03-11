import { defineStore } from "pinia";
import { SalesStatusId } from "@/utilities/consts";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      companiesList: [],
      toastMessage: {
        type: "",
        message: ""
      }
    };
  },
  getters: {
    totalCountByStatusId(state) {
      return (id) => {
        const filteredList = state.companiesList.filter((company) => {
          return company.StatusId === id;
        });
        return filteredList.length;
      };
    },
    totalCountWithStatusFollow() {
      return this.totalCountByStatusId(SalesStatusId.Follow);
    },
    totalCountWithStatusLeads() {
      return this.totalCountByStatusId(SalesStatusId.Leads);
    },
    totalCountWithStatusClosed() {
      return this.totalCountByStatusId(SalesStatusId.Closed);
    }
  },
  actions: {
    setCompaniesList(list) {
      this.companiesList = list;
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
    }
  },
  persist: true
});
