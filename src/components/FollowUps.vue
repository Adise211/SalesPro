<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6">
        <!-- 1) Charts -->
        <ViewCards>
          <template v-slot:card-text>
            <!-- <AppCharts></AppCharts> -->
          </template>
        </ViewCards>
      </v-col>
      <v-col md="6">
        <!-- 2) List -->
        <ViewCards>
          <template v-slot:card-text>
            <div class="d-flex flex-row align-start">
              <v-text-field
                v-model="companyName"
                placeholder="Add new follow up"
                variant="outlined"
                density="compact"
                color="primary"
                style="max-width: 50%"
              >
              </v-text-field>
              <v-btn
                color="success"
                class="ml-2"
                height="37"
                @click="addNewItem"
                :loading="isAddBtnLoading"
                >Add</v-btn
              >
            </div>
            <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              :items-per-page="itemsPerPage"
              :height="400"
            >
              <!-- table body (items) -->
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-medium-emphasis">{{ item.Company }}</td>
                  <td class="text-medium-emphasis">{{ item.LastUpdated }}</td>
                  <td>
                    <v-btn color="primary" density="compact">
                      Change Status
                      <v-menu activator="parent">
                        <v-list>
                          <v-list-item v-for="item in statusTypes" :key="item.Id" :value="item.Id">
                            <v-list-item-title>{{ item.Status }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </td>
                  <td class="text-center">
                    <v-icon @click="deleteItem(item)" color="error"> mdi-delete </v-icon>
                  </td>
                </tr>
              </template>
              <!-- table footer (paging) -->
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination v-model="page" :length="pageCount"></v-pagination>
                </div>
              </template>
            </v-data-table>
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";
import { TrackingStatusTypes, ToastMessages } from "../utilities/consts";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "../stores/general";
import { createNewCompany, removeComapny } from "../firebase/services/data";
import moment from "moment";

export default {
  name: "FollowUps",
  components: { ViewCards },
  props: {},
  data: () => ({
    itemsPerPage: "5",
    page: 1,
    companyName: "",
    isAddBtnLoading: false
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["addNewCompanyInStore", "removeCompanyFromStore"]),
    async addNewItem() {
      let toastMessage;
      let toastType;
      this.isAddBtnLoading = true;
      const today = moment(new Date()).format("YYYY-MM-DD");
      const newCompanyObj = {
        Company: this.companyName,
        LastUpdated: today,
        Status: "followups"
      };
      const response = await createNewCompany(newCompanyObj);
      if (response.success) {
        this.addNewCompanyInStore(newCompanyObj);
        toastMessage = ToastMessages.SuccessMessages.Created;
        toastType = "success";
      } else {
        toastMessage = response.message;
        toastType = "error";
      }

      this.isAddBtnLoading = false;
      this.$toast.open({
        type: toastType,
        message: toastMessage
      });
    },
    async deleteItem(item) {
      const response = await removeComapny(item);
      if (response.success) {
        this.removeCompanyFromStore(item);
      }
      this.$toast.open({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "Company"
        },
        {
          title: "Last update",
          key: "LastUpdated"
        },
        {
          title: "Status",
          align: "center",
          sortable: false
        },
        {
          title: "Delete",
          align: "center",
          sortable: false
        }
      ];
    },
    tableItems() {
      let result;
      if (this.companiesList.length > 0) {
        result = this.companiesList.filter((company) => {
          if (company.Status === "followups") return company;
        });
      } else {
        result = [];
      }
      return result;
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
    },
    statusTypes() {
      return TrackingStatusTypes.filter((type) => {
        return type.Id !== 0;
      });
    }
  },
  watch: {}
};
</script>

<style scoped></style>
