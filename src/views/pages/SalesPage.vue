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
  <v-dialog v-model="isDialogOpen" width="60%" height="85%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div class="d-flex justify-space-between">
          <div>Add Company</div>
          <div class="text-medium-emphasis text-h6">
            steps:
            <span
              class="mx-1"
              :class="{ 'text-blue font-weight-bold': currentFormStep === formSteps.First }"
              >1</span
            >
            <span
              class="mx-1"
              :class="{ 'text-blue font-weight-bold': currentFormStep === formSteps.Second }"
              >2</span
            >
          </div>
        </div>
      </template>
      <template v-slot:card-text>
        <v-form ref="form">
          <!-- Step One - Comapny Info -->
          <v-container v-if="currentFormStep === 1">
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) company's name -->
                <v-text-field
                  label="Company Name*"
                  v-model="currentCompany.Name"
                  :rules="[formRules.required]"
                  append-inner-icon="mdi-domain"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) contact person name -->
                <v-select
                  label="Business Sector"
                  v-model="currentCompany.BusinessSector"
                  :items="businessSectorsList"
                ></v-select>
              </v-col>
              <v-col>
                <!-- 2) contact person name -->
                <v-text-field
                  label="Contact Person"
                  v-model="currentCompany.ContactPerson"
                  append-inner-icon="mdi-account-tie"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) contact person role -->
                <v-text-field
                  label="Contact Person Role"
                  v-model="currentCompany.ContactPersonRole"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row class="mb-2">
              <v-col>
                <v-text-field
                  label="Email"
                  v-model="currentCompany.Email"
                  append-inner-icon="mdi-email"
                  type="email"
                  :rules="[formRules.emailMatch, formRules.required]"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Phone Number"
                  v-model="currentCompany.Phone"
                  append-inner-icon="mdi-phone"
                  type="tel"
                  :rules="[formRules.numbersOnly]"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  label="Website Url"
                  v-model="currentCompany.WebsiteUrl"
                  append-inner-icon="mdi-web"
                  type="url"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <!-- Third Row -->
            <v-row class="mt-6">
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.Address1"
                  label="Address 1"
                  append-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.Address2"
                  label="Address 2 (optinal)"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Fourth Row -->
            <v-row>
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.Country"
                  label="Country"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.State"
                  label="State"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.City"
                  label="City"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentCompany.Location.ZipCode"
                  label="Zip Code"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <!-- Step Two - Inner Info -->
          <v-container v-else>
            <v-row>
              <v-col>
                <v-select
                  v-model="currentCompany.ProductId"
                  label="Product/Service"
                  :items="['q-99', 'Q-10']"
                  append-inner-icon="mdi-package-variant"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="currentCompany.StatusId"
                  label="Status"
                  :items="salesStatusSelectList"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="currentCompany.Teams"
                  label="Teams"
                  :items="['Sales', 'Tech']"
                ></v-select>
              </v-col>
              <v-col>
                <v-select
                  v-model="currentCompany.FileId"
                  label="Attach File"
                  :items="['file_1.xl', 'file_2.pdf']"
                  append-inner-icon="mdi-file-search"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">
                <v-radio-group
                  label="Do you want to set a reminder?"
                  inline
                  :disabled="currentCompany.StatusId === 3"
                  v-model="isSetReminder"
                >
                  <v-radio label="Yes" :value="true"></v-radio>
                  <v-radio label="No" :value="false"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="3">
                <v-select
                  label="Every"
                  v-model="currentCompany.ReminderFrequency"
                  :disabled="currentCompany.StatusId === 3 || !isSetReminder"
                  :items="reminderFrequencySelectItems"
                >
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea label="Note"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="primary" variant="text" @click="onDialogClose">Cancel</v-btn>
          <v-btn
            v-if="currentFormStep === formSteps.First"
            color="primary"
            variant="flat"
            @click="moveToNextFormStep"
            >Next</v-btn
          >

          <v-btn v-else color="primary" variant="flat" @click="onSaveItem" :loading="isLoading"
            >Save</v-btn
          >
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
import {
  SalesStatusId,
  ToastMessages,
  BusinessSectors,
  SalesReminderFrequency
} from "@/utilities/consts";
import { createNewCompany, updateCompanyInfo } from "@/firebase/services/data";

const DEFAULT_STATUS_ID = SalesStatusId.Follow;
const FORM_STEPS = {
  First: 1,
  Second: 2
};
const NEW_COMPANY_OBJECT = {
  Id: null, // String
  Name: null, // String
  StatusId: SalesStatusId.Follow, // Number
  Email: null, //String
  Phone: null, //String
  Location: {
    Address1: null,
    Address2: null,
    City: null,
    State: null,
    Country: null,
    ZipCode: null
  },
  ContactPerson: null, // String
  ContactPersonRole: null, // String
  WebsiteUrl: null, // String
  BusinessSector: null, // String
  ProductId: null, // String (productId)
  NoteId: null, // String (noteId)
  Teams: [], // String
  FileId: null, // String
  ReminderFrequency: SalesReminderFrequency.Weekly // Number (Daily-1, Weekly-2, Monthly-3) ,
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
    formSteps: FORM_STEPS,
    currentFormStep: FORM_STEPS.First,
    isSetReminder: false
  }),
  created() {},
  async mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["updateCompaniesListInStore", "setToastMessage"]),
    onToolbarItemClick(item) {
      // Update active status (number)
      this.activeStatusId = SalesStatusId[item];
    },
    async moveToNextFormStep() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        this.currentFormStep = this.formSteps.Second;
      }
    },
    async onSaveItem() {
      console.log("CURRENT COMAPNY", this.currentCompany);

      let toastType;
      let toastMessage;
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.isLoading = true;
        // If a reminder was not set - send value of 0 to API
        if (!this.isSetReminder) {
          this.currentCompany.ReminderFrequency = 0;
        }
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
      this.isSetReminder = false;
      this.currentFormStep = this.formSteps.First;
    }
  },
  computed: {
    toolbarItems() {
      return Object.keys(SalesStatusId);
    },
    salesStatusSelectList() {
      return [
        { title: this.toolbarItems[0], value: SalesStatusId.Follow },
        { title: this.toolbarItems[1], value: SalesStatusId.Leads },
        { title: this.toolbarItems[2], value: SalesStatusId.Closed }
      ];
    },
    formRules() {
      const EMAIL_REGEXP = new RegExp(
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
      );
      const NUMBERS_REGEX = new RegExp(/^\d+$/);

      return {
        required: (value) => !!value || "Field is required",
        emailMatch: (value) =>
          !value || (!!value && EMAIL_REGEXP.test(value.trim())) || "Invalid e-mail.",
        numbersOnly: (value) =>
          !value || (!!value && NUMBERS_REGEX.test(value)) || "Insert numbers only"
      };
    },
    businessSectorsList() {
      // Sorted by abc
      return BusinessSectors.sort();
    },
    reminderFrequencySelectItems() {
      return [
        { title: "Day", value: SalesReminderFrequency.Daily },
        { title: "Week", value: SalesReminderFrequency.Weekly },
        { title: "Month", value: SalesReminderFrequency.Monthly }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
