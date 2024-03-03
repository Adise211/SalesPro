<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableItems"
    :items-per-page="itemsPerPage"
    :height="390"
    :page="page"
    :search="searchExpression"
    class="mt-3"
  >
    <!-- table body (items) -->
    <template v-slot:item="{ item }">
      <tr>
        <td class="text-medium-emphasis">{{ item.companyName }}</td>
        <td class="text-medium-emphasis">{{ item.contactInfo }}</td>
        <td class="text-medium-emphasis">{{ item.location }}</td>
        <td class="text-medium-emphasis">{{ item.product }}</td>
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
          <v-icon>mdi-pencil</v-icon>
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

<script>
import { ToastMessages, TrackingTypes } from "@/utilities/consts";
import { convertDate } from "@/utilities/utilsFuncs";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeCompany } from "@/firebase/services/data";
import moment from "moment";

export default {
  name: "FollowUps",
  components: {},
  props: {
    currentStageName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    itemsPerPage: "6",
    page: 1,
    companyName: "",
    isAddBtnLoading: false,
    isDeleteDialogOpen: false,
    currentItem: {},
    showChart: true,
    searchExpression: ""
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["addNewCompanyInStore", "removeCompanyFromStore"]),
    async addNewItem() {
      //
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
      this.refreshActiveChart();
      this.$toast.open({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
      // Reset current item and close dialog
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
      return convertDate(date).MDYFormat;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    currentStatusId() {
      let id;

      switch (this.currentStageName) {
        case TrackingTypes.FollowUps.value:
          id = TrackingTypes.FollowUps.id;
          break;
        case TrackingTypes.Leads.value:
          id = TrackingTypes.Leads.id;
          break;
        case TrackingTypes.Closed.value:
          id = TrackingTypes.Closed.id;
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
          key: "companyName"
        },
        {
          title: "Contact Info",
          key: "contactInfo"
        },
        {
          title: "Location",
          key: "location"
        },
        {
          title: "My Product",
          key: "product"
        },
        {
          title: "Last update",
          key: "lastUpdate"
        },
        {
          title: "Notes",
          // align: "center",
          sortable: false
        },
        {
          title: "Edit",
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
      let result = [];
      if (this.companiesList.length > 0) {
        result = this.companiesList.filter((comp) => {
          if (comp.trackingStatus === this.currentStatusId) return comp;
        });
      }
      return result;
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
    },
    filteredStatus() {
      // Get all except from the current status
      return TrackingTypes.filter((item) => {
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

<style scoped></style>
