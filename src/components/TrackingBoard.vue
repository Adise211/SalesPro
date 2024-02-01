<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6">
        <!-- 1) Charts -->
        <ViewCards cardTextFillHeight>
          <template v-slot:card-text>
            <AppCharts
              v-if="showChart"
              :chartXData="currentChartXData"
              :chartSeriesData="currentChartYData"
              :chartType="'bar'"
            ></AppCharts>
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
                placeholder="Add new item"
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
              :height="415"
              :page="page"
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
                          <v-list-item
                            v-for="oneType in statusTypes"
                            :key="oneType.Id"
                            :value="oneType.Id"
                          >
                            <v-list-item-title @click="changeStatusHandler(oneType, item)">{{
                              oneType.Status
                            }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </td>
                  <td class="text-center">
                    <v-icon @click="onDeleteIconClick(item)" color="error"> mdi-delete </v-icon>
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
    <v-dialog v-model="isDeleteDialogOpen" width="500">
      <v-card height="120px">
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <div class="d-flex flex-row justify-start ml-auto">
            <v-btn color="primary" variant="flat" @click="deleteItem(currentItem)">I am sure</v-btn>
            <v-btn color="primary" variant="outlined" @click="isDeleteDialogOpen = false"
              >Never mind</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";
import AppCharts from "./AppCharts.vue";
import { TrackingStatusTypes, ToastMessages, TrackingStagesId } from "@/utilities/consts";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { createNewCompany, removeCompany } from "@/firebase/services/data";
import moment from "moment";

export default {
  name: "FollowUps",
  components: { ViewCards, AppCharts },
  props: {
    currentStage: {
      type: String,
      default: ""
    },
    statusId: Number
  },
  data: () => ({
    itemsPerPage: "6",
    page: 1,
    companyName: "",
    isAddBtnLoading: false,
    isDeleteDialogOpen: false,
    currentItem: {},
    showChart: true
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
      this.companyName = "";
      this.$toast.open({
        type: toastType,
        message: toastMessage
      });
    },
    onDeleteIconClick(item) {
      this.currentItem = item;
      this.isDeleteDialogOpen = true;
    },
    async deleteItem(item) {
      const response = await removeCompany(item);
      if (response.success) {
        this.removeCompanyFromStore(item);
      }
      this.$toast.open({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
      // Reset current item and close dialog
      this.currentItem = {};
      this.isDeleteDialogOpen = false;
    },
    changeStatusHandler(toStatus, selectedItem) {
      const newStatusKey = toStatus.Status.split(" ").join("");
      selectedItem.Status = TrackingStagesId[newStatusKey];
      selectedItem.LastUpdated = moment(new Date()).format("YYYY-MM-DD");
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
          if (company.Status === this.currentStage) return company;
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
        return type.Id !== this.statusId;
      });
    },
    currentChartXData() {
      return moment.monthsShort();
    },
    currentChartYData() {
      // create shallow copy
      const monthsShortCopy = [...this.currentChartXData];
      const itemsDatesByMonth = {};
      // divide item dates by months
      // and insert into "itemsDatesByMonth" object
      this.tableItems.map((item) => {
        const itemMonth = moment(item.LastUpdated).month();
        if (itemsDatesByMonth[itemMonth]) {
          itemsDatesByMonth[itemMonth].push(item.LastUpdated);
        } else {
          itemsDatesByMonth[itemMonth] = [];
          itemsDatesByMonth[itemMonth].push(item.LastUpdated);
        }
      });

      const objKeys = Object.keys(itemsDatesByMonth);
      // take the 12 months of the year
      this.currentChartXData.map((_, index) => {
        // if a month of a year has dates from "itemsDatesByMonth" - replace it with
        // the amount of dates
        if (objKeys.includes(`${index}`)) {
          monthsShortCopy.splice(index, 1, itemsDatesByMonth[index].length);
        } else {
          // otherwise - replace it with 0 amount of dates
          monthsShortCopy.splice(index, 1, 0);
        }
      });
      return monthsShortCopy;
    }
  },
  watch: {
    currentStage(newVal) {
      if (newVal) {
        this.showChart = false;

        setTimeout(() => {
          this.showChart = true;
        }, 200);
      }
    }
  }
};
</script>

<style scoped></style>
