<template>
  <v-container fluid class="notes-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="8"> </v-col>
      <v-col md="4"> </v-col>
    </v-row>
    <!-- Before Delete Dialog -->
    <v-dialog v-model="isDeleteDialogOpen" width="500">
      <v-card height="120px">
        <v-card-text>Are you sure you want to delete this item?</v-card-text>
        <v-card-actions>
          <div class="d-flex flex-row justify-start ml-auto">
            <v-btn color="primary" variant="flat" @click="deleteItem(selectedNote)">Yes</v-btn>
            <v-btn color="primary" variant="outlined" @click="isDeleteDialogOpen = false">No</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Create/Update Note -->
    <AppNoteDialog
      :isDialogOpen="isNoteDialogOpen"
      :selectedNote="selectedNote"
      :isOnEditMode="isOnEditMode"
      @onDialogClose="onDialogClose"
    ></AppNoteDialog>
  </v-container>
</template>

<script>
import AppNoteDialog from "@/components/AppNoteDialog.vue";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { removeNote } from "@/firebase/services/data";
import { ToastMessages } from "@/utilities/consts";

export default {
  name: "NotesPage",
  components: { AppNoteDialog },
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
    onNoteRowDB() {
      console.log("Hi There!");
    },
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
      this.isOnEditMode = true;
      this.selectedNote = note;
      this.isNoteDialogOpen = true;
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
    },
    onDialogClose() {
      this.isNoteDialogOpen = false;
      this.isOnEditMode = false;
      this.selectedNote = {};
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList", "userNotesList"]),
    tableHeaders() {
      return [
        {
          title: "Title",
          key: "title",
          maxWidth: "20%"
        },
        {
          title: "Reffer To",
          key: "companyId"
        },
        {
          title: "Due Date",
          key: "date",
          align: "center",
          width: "25%"
        },
        {
          title: "Reminder",
          sortable: false,
          width: "6%"
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
  watch: {
    userNotesList: {
      handler(newData) {
        console.log("UPDATED NOTES LIST?", newData[0].remindMe);
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.app-text-truncate {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
