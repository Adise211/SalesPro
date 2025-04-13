<template>
  <v-data-table-virtual
    :headers="tableHeaders"
    :items="tableItems"
    item-value="Id"
    :height="390"
    :search="searchExp"
    class="mt-3"
  >
  </v-data-table-virtual>
  <!-- confirm delete dialog -->
  <v-dialog v-model="isDeleteDialogOpen" width="30%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div>Delete Item</div>
      </template>
      <template v-slot:card-text>
        <div>Do you want to delete this item?</div>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="primary" variant="text" @click="isDeleteDialogOpen = false">No</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="deleteConfirmationHandler"
            :loading="isConfirmDeleteLoading"
            >Yes</v-btn
          >
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import { ToastMessages, SalesStatusId, TableColumnsWidthValue } from "@/utilities/consts";
import AppCard from "@/components/AppCard.vue";
import { convertDate, convertLocationToString } from "@/utilities/utilsFuncs";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeCompany } from "@/firebase/services/workspace";
// import companies from "../../public/_config/dummyDate/sales.json";

const DEFAULT_STATUS_ID = SalesStatusId.Follow;

export default {
  name: "FollowUps",
  components: { AppCard },
  emits: ["onEditItem"],
  props: {
    activeStatusId: {
      type: Number,
      default: DEFAULT_STATUS_ID
    },
    searchExp: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    isDeleteDialogOpen: false,
    isConfirmDeleteLoading: false,
    currentItem: {}
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
      this.setToastMessage({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
      // Reset current item + loading + close dialog
      this.isConfirmDeleteLoading = false;
      this.currentItem = {};
      this.isDeleteDialogOpen = false;
    },
    onItemNoteClick() {
      // If there is an attched note - open note fron the parent
    },
    changedDateFormat(date) {
      const fromEpochTime = true;
      return convertDate(date, fromEpochTime).MDYFormat;
    },
    convertLocation(locationObject) {
      return convertLocationToString(locationObject);
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "Company",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Business Sector",
          key: "Email",
          align: "center",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Email",
          key: "Phone",
          align: "center",
          sortable: false,
          width: TableColumnsWidthValue.Large
        },
        {
          title: "Product",
          key: "ProductId",
          align: "center",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Updated By",
          key: "UpdatedBy",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "LastUpdated",
          key: "LastUpdated",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Actions",
          key: "",
          sortable: false,
          width: TableColumnsWidthValue.XSmall
        }
      ];
    },
    tableItems() {
      // Filter by status id
      // const filteredItems = this.companiesList.filter((company) => {
      //   return company.StatusId === this.activeStatusId;
      // });

      // return filteredItems || [];
      return [];
    }
  },
  watch: {}
};
</script>

<style scoped>
.app-text-truncate {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expanded-row-th-width-small {
  width: 10%;
}

.expanded-row-th-width-meduim {
  width: 15%;
}

.expanded-row-th-width-large {
  width: 20%;
}
</style>
