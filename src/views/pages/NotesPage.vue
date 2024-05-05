<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <v-col md="8">
        <AppCard>
          <template v-slot:card-text>
            <v-row class="mb-7 pt-2 align-center">
              <v-col md="5">
                <v-text-field
                  v-model="searchExpression"
                  hide-details
                  single-line
                  placeholder="Search here..."
                  append-inner-icon="mdi-magnify"
                >
                </v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col md="4" class="text-end">
                <v-btn
                  variant="text"
                  color="primary"
                  prepend-icon="mdi-plus"
                  @click="isNoteDialogOpen = true"
                  >Add Note</v-btn
                >
              </v-col>
            </v-row>
            <v-data-table
              class="notes-table"
              :headers="tableHeaders"
              :items="tableItems"
              :items-per-page="itemsPerPage"
              :height="415"
              :page="page"
              :search="searchExpression"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-medium-emphasis">{{ item.noteId }}</td>
                  <td class="text-medium-emphasis">{{ companyNameById(item.companyId) }}</td>
                  <td class="text-medium-emphasis">{{ item.date }}</td>
                  <td class="text-center">
                    <v-icon v-if="item.RemindMe" icon="mdi-bell" color="#eab308"></v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon icon="mdi-pencil" @click="onEditNoteClick(item)"></v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon @click="onDeleteIconClick(item)" color="error"> mdi-delete </v-icon>
                  </td>
                </tr>
              </template>
              <template v-slot:bottom>
                <div class="text-center pt-2">
                  <v-pagination v-model="page" :length="pageCount"></v-pagination>
                </div>
              </template>
            </v-data-table>
          </template>
        </AppCard>
      </v-col>
      <v-col md="4">
        <div class="d-flex flex-column fill-height">
          <AppCard class="view-notes h-50">
            <template v-slot:card-text>
              <div>soon will show the note (reminder)..</div>
            </template>
          </AppCard>
          <AppCard class="create-notes mt-3" :cardTextClass="'fill-height'">
            <template v-slot:card-text>
              <div>last updated notes list ....</div>
            </template>
          </AppCard>
        </div>
      </v-col>
    </v-row>
    <!-- Before Delete Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" width="500">
      <v-card height="120px">
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <div class="d-flex flex-row justify-start ml-auto">
            <v-btn color="primary" variant="flat" @click="deleteItem(selectedNote)"
              >I am sure</v-btn
            >
            <v-btn color="primary" variant="outlined" @click="isDeleteDialogOpen = false"
              >Never mind</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Create/Update Note -->
    <AppNoteDialog
      :isDialogOpen="isNoteDialogOpen"
      :selectedNote="selectedNote"
      @onDialogClose="isNoteDialogOpen = false"
    ></AppNoteDialog>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import AppNoteDialog from "@/components/AppNoteDialog.vue";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeNote } from "@/firebase/services/data";
import { ToastMessages } from "@/utilities/consts";

export default {
  name: "NotesPage",
  components: { AppCard, AppNoteDialog },
  props: {},
  data: () => ({
    page: 1,
    itemsPerPage: "6",
    searchExpression: "",
    isNoteDialogOpen: false,
    selectedNote: {},
    currentNoteId: null,
    isOnEditMode: false,
    isDeleteDialogOpen: false
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, [
      "updateUserNotesListInStore",
      "removeNoteFromStore",
      "setToastMessage"
    ]),
    companyNameById(id) {
      if (this.userNotesList.length > 0 && id) {
        // Find the comapny with the passed id
        const existNote = this.companiesList.find((company) => {
          return company.companyId === id;
        });
        // Return the name of the company
        return existNote.companyName;
      }
    },
    async onEditNoteClick(note) {
      this.isNoteDialogOpen = true;
      this.isOnEditMode = true;
      this.selectedNote = note;
    },
    onDeleteIconClick(item) {
      this.selectedNote = item;
      this.isDeleteDialogOpen = true;
    },
    async deleteItem(item) {
      const response = await removeNote(item);
      if (response.success) {
        this.removeNoteFromStore(item);
      }
      this.setToastMessage({
        type: "success",
        message: ToastMessages.SuccessMessages.Removed
      });
      // Reset current item and close dialog
      this.selectedNote = {};
      this.isDeleteDialogOpen = false;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    tableHeaders() {
      return [
        {
          title: "Title",
          key: "title"
        },
        {
          title: "Reffer To",
          key: "companyId"
        },
        {
          title: "Date",
          key: "date"
        },
        {
          title: "Reminder",
          sortable: false
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
      return this.userNotesList;
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
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

<style scoped lang="scss">
// .notes-table:deep(.v-table__wrapper) {
//   th:nth-child(3n) {
//     width: 24%;
//   }
// }
</style>
