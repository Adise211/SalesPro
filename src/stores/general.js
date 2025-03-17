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
    },
    addProductToListInStore(data) {
      const IS_EXIST = this.productsList.find((product) => {
        return product.Id === data.Id;
      });
      if (!IS_EXIST) this.productsList.push(data);
    },
    updateProductInStore(data) {
      const PRODUCT_INDEX = this.productsList.findIndex((product) => {
        return product.Id === data.Id;
      });
      if (PRODUCT_INDEX > -1) {
        this.productsList.splice(PRODUCT_INDEX, 1, data);
      }
    },
    removeProductFromStore(data) {
      const PRODUCT_INDEX = this.productsList.indexOf(data);
      // only splice array when item is found
      if (PRODUCT_INDEX > -1) {
        this.productsList.splice(PRODUCT_INDEX, 1); // 2nd parameter means remove one item only
      }
    }
  },
  persist: true
});
