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
              :activeStatusId="activeStatusId"
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
                  v-model="currentCompany.Name"
                  :rules="[formRules.required]"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) email -->
                <v-text-field label="Email" v-model="currentCompany.Email"></v-text-field>
              </v-col>
              <v-col>
                <!-- 3) phone number -->
                <v-text-field label="Phone Number" v-model="currentCompany.Phone"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="5">
                <!-- 4) country -->
                <v-autocomplete
                  v-model="currentCompany.Location"
                  label="Location"
                  :items="countriesList"
                  :rules="[formRules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col md="5">
                <!-- 5) city or state -->
                <!-- <v-combobox
                  label="State/City"
                  :items="filteredCities"
                  v-model="currentCompany.stateOrCity"
                  no-data-text="Select country"
                ></v-combobox> -->
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <!-- 4) product -->
                <v-select
                  v-model="currentCompany.ProductId"
                  label="My Product"
                  :items="['q-99', 'Q-10']"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="currentCompany.StatusId"
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
import { SalesStatusId, ToastMessages } from "@/utilities/consts";
import { createNewCompany, updateCompanyInfo } from "@/firebase/services/data";

const DEFAULT_STATUS_ID = SalesStatusId.Follow;
const NEW_COMPANY_OBJECT = {
  Id: null, // String
  Name: null, // String
  StatusId: DEFAULT_STATUS_ID, // Number
  Email: null, //String
  Phone: null, //String
  Location: null, // String
  ProductId: null, // String (productId)
  NoteId: null // String (noteId)
};

export default {
  name: "SalesPage",
  components: { AppCard, AppSalesDataTable },
  props: {},
  data: () => ({
    activeStatusId: DEFAULT_STATUS_ID,
    isDialogOpen: false,
    searchExpression: "",
    currentCompany: { ...NEW_COMPANY_OBJECT },
    editMode: false,
    isLoading: false,
    countriesAndCitiesList: []
  }),
  created() {},
  async mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["updateCompaniesListInStore", "setToastMessage"]),
    onToolbarItemClick(item) {
      // Update active status (number)
      this.activeStatusId = SalesStatusId[item];
    },
    async onSaveItem() {
      console.log("CURRENT COMAPNY", this.currentCompany);

      let toastType;
      let toastMessage;
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.isLoading = true;
        // If not on edit mode - create new
        if (!this.editMode) {
          const createResponse = await createNewCompany(this.currentCompany);

          if (createResponse.Result.ResultCode > 0) {
            // Add to store + show success toast message
            // this.updateCompaniesListInStore(createResponse.Data);
            toastType = "success";
            toastMessage = ToastMessages.SuccessMessages.Created;
          } else {
            // Show error toast message
            toastType = "error";
            toastMessage = ToastMessages.ErrorMessages.Created;
          }
        } else {
          // On edit mode - update
          const updateResponse = await updateCompanyInfo(this.currentCompany);
          if (updateResponse.Result.ResultCode > 0) {
            // Add to store + show success toast message
            this.updateCompaniesListInStore(updateResponse.Data);
            toastType = "success";
            toastMessage = ToastMessages.SuccessMessages.Updated;
          } else {
            // Show error toast message
            toastType = "error";
            toastMessage = ToastMessages.ErrorMessages.Updated;
          }
        }

        // End loading and close dialog
        this.isLoading = false;
        this.setToastMessage({
          type: toastType,
          message: toastMessage
        });
        this.onDialogClose();
      }
    },
    editItemHandler(item) {
      this.currentCompany = item;
      this.isDialogOpen = true;
      this.editMode = true;
    },
    onDialogClose() {
      // close dialogs
      this.isDialogOpen = false;
      // reset states
      this.currentCompany = { ...NEW_COMPANY_OBJECT };
      this.editMode = false;
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
    }
  },
  watch: {}
};
</script>

<style scoped></style>
