import { defineStore } from "pinia";
import { SalesStatusId } from "@/utilities/consts";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      companiesList: [],
      productsList: [],
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
    setProductsList(list) {
      this.productsList = list;
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
    addItemToListInStore(listName, newItem) {
      // Check if item is exist in the given list
      const IS_EXIST = this[listName].find((item) => {
        return item.Id === newItem.Id;
      });
      // If not exist - add it
      if (!IS_EXIST) this[listName].push(newItem);
    },
    updateItemFromListInStore(listName, newItem) {
      // Find previous item index in the given list
      const PREV_ITEM_INDEX = this[listName].findIndex((item) => {
        return item.Id === newItem.Id;
      });
      // If prev item exist - replace it with the new one
      if (PREV_ITEM_INDEX > -1) {
        this[listName].splice(PREV_ITEM_INDEX, 1, newItem);
      }
    },
    removeItemFromListInStore(listName, item) {
      // Find item index
      const ITEM_INDEX = this[listName].indexOf(item);
      // If exist - remove it
      if (ITEM_INDEX > -1) {
        this[listName].splice(ITEM_INDEX, 1); // 2nd parameter means remove one item only
      }
    },
    addCompanyToListInStore(data) {
      const IS_EXIST = this.companiesList.find((company) => {
        return company.Id === data.Id;
      });
      if (!IS_EXIST) this.companiesList.push(data);
    },
    updateCompanyInStore(data) {
      const COMPANY_INDEX = this.companiesList.findIndex((company) => {
        return company.Id === data.Id;
      });
      if (COMPANY_INDEX > -1) {
        this.companiesList.splice(COMPANY_INDEX, 1, data);
      }
    },
    removeCompanyFromStore(data) {
      const COMPANY_INDEX = this.companiesList.indexOf(data);
      // only splice array when item is found
      if (COMPANY_INDEX > -1) {
        this.companiesList.splice(COMPANY_INDEX, 1); // 2nd parameter means remove one item only
      }
    }
  },
  persist: true
});
