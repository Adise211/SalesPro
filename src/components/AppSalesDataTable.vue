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
        <td class="text-medium-emphasis app-text-truncate">{{ item.Name }}</td>
        <td class="text-medium-emphasis app-text-truncate">{{ item.Email }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.Phone }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.WebsiteUrl }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">
          {{ item.ContactPerson }}
        </td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.ProductId }}</td>
        <td class="text-medium-emphasis text-center">{{ changedDateFormat(item.LastUpdated) }}</td>
        <td class="text-center">
          <v-menu activator="parent">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props"> mdi-dots-vertical</v-icon>
            </template>
            <v-list width="100">
              <v-list-item @click="onEditItem(item)">
                <v-list-item-title>Edit</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onItemNoteClick(item)">
                <v-list-item-title>Note</v-list-item-title>
              </v-list-item>
              <v-list-item @click="onDeleteItem(item)">
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
import { ToastMessages, SalesStatusId } from "@/utilities/consts";
import AppCard from "@/components/AppCard.vue";
import { convertDate } from "@/utilities/utilsFuncs";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeCompany } from "@/firebase/services/data";

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
    itemsPerPage: "6",
    page: 1,
    companyName: "",
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
    onItemNoteClick() {
      // If there is an attched note - open note fron the parent
    },
    changedDateFormat(date) {
      const fromEpochTime = true;
      return convertDate(date, fromEpochTime).MDYFormat;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    tableHeaders() {
      return [
        {
          title: "Name",
          key: "Name",
          width: ""
        },
        {
          title: "Email",
          key: "Email",
          align: "center"
        },
        {
          title: "Phone",
          key: "Phone",
          align: "center",
          sortable: false,
          width: "15%"
        },
        {
          title: "Website",
          key: "WebsiteUrl",
          align: "center",
          sortable: false,
          width: "15%"
        },
        {
          title: "Contact Person",
          key: "ContactPerson",
          align: "center",
          width: "15%"
        },
        {
          title: "Product/Service",
          key: "ProductId",
          align: "center",
          width: "20%"
        },
        {
          title: "LastUpdated",
          key: "LastUpdated",
          align: "center",
          sortable: false,
          width: "10%"
        },
        {
          title: "",
          key: "",
          sortable: false,
          width: "5%"
        }
      ];
    },
    tableItems() {
      // Filter by status id
      const filteredItems = this.companiesList.filter((company) => {
        return company.StatusId === this.activeStatusId;
      });

      return filteredItems || [];
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
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
</style>
