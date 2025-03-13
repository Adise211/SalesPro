<template>
  <v-data-table
    :headers="tableHeaders"
    :items="tableItems"
    item-value="Id"
    :items-per-page="itemsPerPage"
    :height="390"
    :page="page"
    :search="searchExp"
    class="mt-3"
    show-expand
  >
    <!-- table body (items) -->
    <template v-slot:item="{ item, isExpanded, toggleExpand, internalItem }">
      <tr>
        <td class="text-medium-emphasis app-text-truncate">{{ item.Name }}</td>
        <td class="text-medium-emphasis app-text-truncate">{{ item.Email }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.Phone }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.WebsiteUrl }}</td>
        <td class="text-medium-emphasis app-text-truncate text-center">
          {{ item.ContactPerson }}
        </td>
        <td class="text-medium-emphasis app-text-truncate text-center">{{ item.ProductId }}</td>
        <td class="text-medium-emphasis">{{ changedDateFormat(item.LastUpdated) }}</td>
        <td>
          <v-btn
            :text="isExpanded(internalItem) ? 'Collapse' : 'More info'"
            color="white"
            size="small"
            variant="text"
            class="bg-primary"
            slim
            @click="toggleExpand(internalItem)"
          >
            <template v-slot:append>
              <v-icon color="white"
                >{{ isExpanded(internalItem) ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </template>
          </v-btn>
        </td>
      </tr>
    </template>
    <!-- table body - expanded row -->
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length" class="py-2">
          <v-sheet rounded="lg" border>
            <v-table density="compact">
              <tbody class="bg-grey-lighten-4">
                <tr>
                  <th class="expanded-row-th-width-meduim">Business Sector</th>
                  <th class="expanded-row-th-width-meduim">Location</th>
                  <th class="expanded-row-th-width-meduim">Contact Person Role</th>
                  <th>Attached File</th>
                  <th>Teams</th>
                  <th class="expanded-row-th-width-large">Note</th>
                  <th></th>
                </tr>
              </tbody>

              <tbody>
                <tr>
                  <td>{{ item.BusinessSector }}</td>
                  <td>{{ item.Location.Country }}</td>
                  <td>{{ item.ContactPersonRole }}</td>
                  <td>{{ item.FileId }}</td>
                  <td>{{ item.Teams.length ? item.Teams.toString() : "" }}</td>
                  <td>{{ item.Note }}</td>
                  <td class="text-center">
                    <v-icon size="small" @click="onEditItem(item)">mdi-pencil</v-icon>
                    <v-icon size="small" color="error" class="ml-2" @click="onDeleteItem(item)"
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-sheet>
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
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    tableHeaders() {
      return [
        {
          title: "Name",
          key: "Name",
          width: "15%"
        },
        {
          title: "Email",
          key: "Email",
          align: "center",
          width: "20%"
        },
        {
          title: "Phone",
          key: "Phone",
          align: "center",
          sortable: false,
          width: "10%"
        },
        {
          title: "Website",
          key: "WebsiteUrl",
          align: "center",
          sortable: false,
          width: "10%"
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
          width: "15%"
        },
        {
          title: "Last Updated",
          key: "LastUpdated",
          width: "15%"
        },
        {
          title: "",
          key: "",
          sortable: false,
          width: "10%"
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

.expanded-row-th-width-small {
  width: 10px;
}

.expanded-row-th-width-meduim {
  width: 15%;
}

.expanded-row-th-width-large {
  width: 20%;
}
</style>
