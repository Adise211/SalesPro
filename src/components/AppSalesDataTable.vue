<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableItems"
    :items-per-page="itemsPerPage"
    :height="390"
    :page="page"
    :search="searchExp"
    class="mt-3"
  >
    <!-- table body (items) -->
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-medium-emphasis app-text-truncate">{{ item.companyName }}</td>
        <td class="text-medium-emphasis app-text-truncate">{{ item.email }}</td>
        <td class="text-medium-emphasis app-text-truncate">{{ item.phoneNumber }}</td>
        <td class="text-medium-emphasis app-text-truncate">
          {{ item.stateOrCity }}{{ item.stateOrCity && item.country ? "," : "" }} {{ item.country }}
        </td>
        <td class="text-medium-emphasis app-text-truncate">{{ item.myProduct }}</td>
        <td class="text-medium-emphasis">{{ changedDateFormat(item.lastUpdate) }}</td>
        <td>
          <v-icon
            v-if="findAttachedNote(item)"
            icon="mdi-note"
            color="grey"
            @click="onItemNoteClick(item)"
          ></v-icon>
        </td>
        <td class="text-center">
          <v-icon @click="onEditItem(item)">mdi-pencil</v-icon>
        </td>
        <td class="text-center">
          <v-icon @click="onDeleteItem(item)" color="error"> mdi-delete </v-icon>
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
  <!-- confirm delete dialog -->
  <v-dialog v-model="isDeleteDialogOpen" width="30%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div>Delete item</div>
      </template>
      <template v-slot:card-text>
        <div>Are you sure you want to delete this item?</div>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div>
          <v-btn
            color="primary"
            variant="text"
            @click="deleteConfirmationHandler"
            :loading="isConfirmDeleteLoading"
            >Yes</v-btn
          >
          <v-btn color="primary" variant="text" @click="isDeleteDialogOpen = false">No</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import { ToastMessages, SaleStatuses } from "@/utilities/consts";
import AppCard from "@/components/AppCard.vue";
import { convertDate } from "@/utilities/utilsFuncs";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeCompany } from "@/firebase/services/data";
import moment from "moment";

export default {
  name: "FollowUps",
  components: { AppCard },
  props: {
    currentStageName: {
      type: String,
      default: ""
    },
    searchExp: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    itemsPerPage: "6",
    page: 1,
    companyName: "",
    isDeleteDialogOpen: false,
    isConfirmDeleteLoading: false,
    currentItem: {},
    showChart: true
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["removeCompanyFromStore", "setToastMessage"]),
    onEditItem(item) {
      // the form in dialog to edit/create company is in the parent
      this.$emit("onEditItem", item);
    },
    onDeleteItem(item) {
      // Save item for future use
      this.currentItem = item;
      // Open confirm delete dialog
      this.isDeleteDialogOpen = true;
    },
    async deleteConfirmationHandler() {
      this.isConfirmDeleteLoading = true;
      const response = await removeCompany(this.currentItem);
      if (response.Result.Success) {
        this.removeCompanyFromStore(this.currentItem);
      }
      this.refreshActiveChart();
      this.setToastMessage({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
      // Reset current item + loading + close dialog
      this.isConfirmDeleteLoading = false;
      this.currentItem = {};
      this.isDeleteDialogOpen = false;
    },
    async changeStatusHandler() {
      //Params: toStatus, selectedItem
      // const newStatusKey = toStatus.Status.split(" ").join("");
      // selectedItem.Status = TrackingStages[newStatusKey];
      // selectedItem.LastUpdated = moment(new Date()).format("YYYY-MM-DD");
      // await updateCompanyInfo(selectedItem);
    },
    refreshActiveChart() {
      this.showChart = false;

      setTimeout(() => {
        this.showChart = true;
      }, 200);
    },
    findAttachedNote(item) {
      // Check if there is a note for this item
      const note = this.userNotesList.find((not) => {
        return not.CompanyName == item.Company;
      });
      return note;
    },
    onItemNoteClick(item) {
      if (this.findAttachedNote(item)) {
        // If there is an attched note - open note fron the parent
        this.$emit("onWatchNote", this.findAttachedNote(item));
      }
    },
    changedDateFormat(date) {
      const fromEpochTime = true;
      return convertDate(date, fromEpochTime).MDYFormat;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    currentStatusId() {
      let id;

      switch (this.currentStageName) {
        case SaleStatuses.FollowUps.value:
          id = SaleStatuses.FollowUps.id;
          break;
        case SaleStatuses.Leads.value:
          id = SaleStatuses.Leads.id;
          break;
        case SaleStatuses.Closed.value:
          id = SaleStatuses.Closed.id;
          break;
        default:
          id = 0;
          break;
      }
      return id;
    },
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "companyName",
          width: "15%"
        },
        {
          title: "Email",
          key: "email",
          align: "center",
          width: "16%"
        },
        {
          title: "Phone",
          key: "phoneNumber",
          width: "10%"
        },
        {
          title: "Location",
          key: "country",
          width: "15%"
        },
        {
          title: "My Product",
          key: "myProduct",
          width: "11%"
        },
        {
          title: "Last Update",
          key: "lastUpdate",
          width: "10%"
        },
        {
          title: "Note",
          sortable: false,
          width: "5%"
        },
        {
          title: "Edit",
          align: "center",
          sortable: false,
          width: "5%"
        },
        {
          title: "Delete",
          align: "center",
          sortable: false,
          width: "5%"
        }
      ];
    },
    tableItems() {
      let result = [];
      if (this.companiesList.length > 0) {
        result = this.companiesList.filter((comp) => {
          if (comp.statusId === this.currentStatusId) return comp;
        });
      }
      return result;
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
    },
    filteredStatus() {
      // Get all except from the current status
      return SaleStatuses.filter((item) => {
        return item.id !== this.currentStatusId;
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
    },
    chartDataColors() {
      // the colors are saved in global.scss
      let colors = ["#008ffb"];
      // if (this.currentStageName === TrackingStages.Leads) {
      //   colors = ["#eab308"];
      // } else if (this.currentStageName === TrackingStages.Closed) {
      //   colors = ["#f4511e"];
      // }
      return colors;
    }
  },
  watch: {
    currentStageName(newVal) {
      if (newVal) {
        this.refreshActiveChart();
      }
    }
  }
};
</script>

<style scoped>
.app-text-truncate {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
