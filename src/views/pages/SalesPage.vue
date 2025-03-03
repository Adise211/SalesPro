<template>
  <v-container fluid>
    <v-row>
      <v-col md="12" class="pa-3">
        <AppCard :cardTextClass="'py-0'">
          <template v-slot:card-text>
            <v-toolbar color="white" height="80">
              <v-text-field
                v-model="searchExpression"
                hide-details
                single-line
                placeholder="Search here..."
                append-inner-icon="mdi-magnify"
              ></v-text-field>
              <v-spacer></v-spacer>

              <v-toolbar-items>
                <v-btn
                  v-for="(item, index) in toolbarItems"
                  :key="index"
                  @click="onToolbarItemClick(item)"
                  :class="{ 'bg-blue-grey-darken-4': index + 1 == activeStatusId }"
                  >{{ item }}</v-btn
                >
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="text"
                @click="isDialogOpen = true"
                prepend-icon="mdi-plus"
                >Add Company</v-btn
              >
            </v-toolbar>
          </template>
        </AppCard>
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col md="12" class="pt-0">
        <AppCard>
          <template v-slot:card-text>
            <AppSalesDataTable
              :statusId="statusId"
              :searchExp="searchExpression"
              @onEditItem="editItemHandler"
            ></AppSalesDataTable>
          </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
  <!-- Create new Company (item) Dialog -->
  <v-dialog v-model="isDialogOpen" width="70%" height="70%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div>Add Company</div>
      </template>
      <template v-slot:card-text>
        <v-form ref="form">
          <v-container>
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) company's name -->
                <v-text-field
                  label="Company's Name*"
                  v-model="itemObject.companyName"
                  :rules="[formRules.required]"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) email -->
                <v-text-field label="Email" v-model="itemObject.email"></v-text-field>
              </v-col>
              <v-col>
                <!-- 3) phone number -->
                <v-text-field label="Phone Number" v-model="itemObject.phoneNumber"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="5">
                <!-- 4) country -->
                <v-autocomplete
                  v-model="itemObject.country"
                  label="Country"
                  :items="countriesList"
                  :rules="[formRules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col md="5">
                <!-- 5) city or state -->
                <v-combobox
                  label="State/City"
                  :items="filteredCities"
                  v-model="itemObject.stateOrCity"
                  no-data-text="Select country"
                ></v-combobox>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <!-- 4) product -->
                <v-select
                  v-model="itemObject.myProduct"
                  label="My Product"
                  :items="['q-99', 'Q-10']"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="itemObject.statusId"
                  label="Status"
                  :items="toolbarItems"
                  item-title="title"
                  item-value="id"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="primary" variant="text" @click="onSaveItem" :loading="isLoading"
            >Save</v-btn
          >
          <v-btn color="primary" variant="text" @click="onDialogClose">Cancel</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppSalesDataTable from "@/components/AppSalesDataTable.vue";
import AppCard from "@/components/AppCard.vue";
import { mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { SalesStatusId, SalesStatusText, ToastMessages } from "@/utilities/consts";
import { Config } from "@/utilities/config";
import {
  createNewCompany,
  updateCompanyInfo,
  getAllCountriesAndCities
} from "@/firebase/services/data";

const DEFAULT_STATUS_ID = SalesStatusId.Follow;

export default {
  name: "SalesPage",
  components: { AppCard, AppSalesDataTable },
  props: {
    statusId: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    activeStatusId: DEFAULT_STATUS_ID,
    isDialogOpen: false,
    searchExpression: "",
    itemObject: { ...Config.DataTemplates.CompanyTemp },
    isLoading: false,
    countriesAndCitiesList: []
  }),
  created() {},
  async mounted() {
    const response = await getAllCountriesAndCities();
    if (response.Result?.Success && response.Data && !response.Data.error) {
      this.countriesAndCitiesList = response.Data.data;
    }
  },
  methods: {
    ...mapActions(useGeneralStore, ["updateCompaniesListInStore", "setToastMessage"]),
    onToolbarItemClick(item) {
      // Update active status (number)
      this.activeStatusId = SalesStatusId[item];

      // Update param in router (text)
      this.$router.push({
        params: {
          statusId: SalesStatusText[item]
        }
      });
    },
    async onSaveItem() {
      let currentToastMsgType;
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.isLoading = true;
        // item doesn't have an id (given one in data.js file) - create
        if (!this.itemObject.companyId) {
          const createResponse = await createNewCompany(this.itemObject);
          if (createResponse.Result.Success) {
            console.log("saved data in DB!", createResponse);
            this.updateCompaniesListInStore(createResponse.Data);
            currentToastMsgType = ToastMessages.SuccessMessages.Created;
          }
        } else {
          // otherwise - update
          const updateResponse = await updateCompanyInfo(this.itemObject);
          if (updateResponse.Result.Success) {
            console.log("updated company info!", updateResponse);
            this.updateCompaniesListInStore(updateResponse.Data);
            currentToastMsgType = ToastMessages.SuccessMessages.Updated;
          }
        }
        this.isLoading = false;
        this.setToastMessage({
          type: "success",
          message: currentToastMsgType
        });
        this.onDialogClose();
      }
    },
    editItemHandler(item) {
      this.itemObject = item;
      this.isDialogOpen = true;
    },
    onDialogClose() {
      // close dialogs
      this.isDialogOpen = false;
      // reset state
      this.itemObject = { ...Config.DataTemplates.CompanyTemp };
    }
  },
  computed: {
    toolbarItems() {
      return Object.keys(SalesStatusId);
    },
    formRules() {
      return {
        required: (value) => !!value || "Field is required"
      };
    },
    countriesList() {
      let countries = [];
      if (this.countriesAndCitiesList.length > 0) {
        countries = this.countriesAndCitiesList.map((item) => {
          return item.country;
        });
      }
      return countries;
    },
    filteredCities() {
      // TODO: Option to select a city and auto fill the country
      let cities = [];
      if (this.countriesAndCitiesList.length > 0 && this.itemObject.country) {
        const selectedCountry = this.countriesAndCitiesList.find((itemInList) => {
          return itemInList.country === this.itemObject.country;
        });
        cities = selectedCountry?.cities || [];
      }
      return cities;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
