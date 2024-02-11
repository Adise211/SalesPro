<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6">
        <div class="d-flex flex-column fill-height">
          <ViewCards class="view-notes h-50">
            <template v-slot:card-text>
              <div>View note (by id)</div>
            </template>
          </ViewCards>
          <ViewCards class="create-notes mt-3" cardTextFillHeight>
            <template v-slot:card-text>
              <div class="fill-height d-flex flex-column">
                <v-form ref="newNoteForm">
                  <!-- Reffer To -->
                  <v-autocomplete
                    v-model="companyName"
                    :items="companiesList"
                    item-title="Company"
                    item-value="Company"
                    :rules="[formRules.required]"
                    placeholder="Reffer to"
                    variant="outlined"
                    density="compact"
                    color="primary"
                    style="max-width: 50%"
                  >
                  </v-autocomplete>
                  <div class="d-flex">
                    <!-- Date -->
                    <v-text-field
                      v-model="selectedDate"
                      type="date"
                      :rules="remindMe ? [formRules.required] : []"
                      variant="outlined"
                      density="compact"
                      color="primary"
                      style="max-width: 30%"
                    >
                    </v-text-field>
                    <!-- Time -->
                    <v-text-field
                      v-model="selectedTime"
                      type="time"
                      :rules="remindMe ? [formRules.required] : []"
                      class="ml-3"
                      variant="outlined"
                      density="compact"
                      color="primary"
                      style="max-width: 20%"
                    >
                    </v-text-field>
                  </div>
                  <!-- Note Description -->
                  <v-textarea
                    v-model="noteDescription"
                    placeholder="Type here..."
                    variant="outlined"
                    color="primary"
                    rows="3"
                  >
                  </v-textarea>
                  <!-- Remind me checkbox (activate reminder) -->
                  <v-checkbox
                    label="Remind me"
                    v-model="remindMe"
                    color="#eab308"
                    density="compact"
                  ></v-checkbox>
                </v-form>
                <!-- Action Buttons -->
                <div class="mt-auto mb-3">
                  <v-btn class="mr-2" color="primary" @click="saveNote" :loading="isSaveNoteLoading"
                    >Save</v-btn
                  >
                  <v-btn variant="outlined" color="primary" @click="onClearForm">Clear</v-btn>
                </div>
              </div>
            </template>
          </ViewCards>
        </div>
      </v-col>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <div class="d-flex justify-space-between">
              <v-text-field
                v-model="searchExpression"
                placeholder="Search"
                variant="outlined"
                density="compact"
                color="primary"
                style="max-width: 50%"
              >
              </v-text-field>
            </div>
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
                  <td class="text-medium-emphasis">{{ item.refferTo }}</td>
                  <td class="text-medium-emphasis">{{ item.lastUpdated }}</td>
                  <td class="text-center">
                    <v-icon icon="mdi-bell" color="#eab308"></v-icon>
                  </td>
                  <td class="text-center">
                    <v-icon icon="mdi-pencil" color="primary"></v-icon>
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
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import "v-calendar/style.css";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { createNewNote } from "@/firebase/services/data";
import { ToastMessages } from "@/utilities/consts";
import moment from "moment";

export default {
  name: "NotesPage",
  components: { ViewCards },
  props: {},
  data: () => ({
    page: 1,
    itemsPerPage: "6",
    searchExpression: "",
    companyName: null,
    noteDescription: "",
    selectedDate: null,
    selectedTime: null,
    remindMe: null,
    isSaveNoteLoading: false
  }),
  created() {},
  mounted() {},
  methods: {
    async saveNote() {
      this.isSaveNoteLoading = true;
      const { valid } = await this.$refs.newNoteForm.validate();
      console.log("is form valid?", valid);

      if (valid) {
        const response = await createNewNote({
          CompanyName: this.companyName,
          NoteDescription: this.noteDescription,
          SelectedDate: this.selectedDate,
          SelectedTime: this.selectedDate,
          RemindMe: this.remindMe
        });
        if (response.success) {
          this.$toast.open({
            type: "success",
            message: ToastMessages.SuccessMessages.Created
          });
        }
      }
      this.isSaveNoteLoading = false;
    },
    onClearForm() {
      this.$refs.newNoteForm.reset();
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    tableHeaders() {
      return [
        {
          title: "Id",
          key: "noteId"
        },
        {
          title: "Reffer to",
          key: "refferTo"
        },
        {
          title: "Last Update",
          key: "lastUpdated"
        },
        {
          title: "Reminder",
          align: "center",
          sortable: false
        },
        {
          title: "Edit",
          align: "center",
          sortable: false
        }
      ];
    },
    tableItems() {
      return [
        {
          noteId: 0,
          refferTo: "Amazon",
          lastUpdated: moment(new Date()).format("YYYY-MM-DD")
        }
      ];
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
.notes-table:deep(.v-table__wrapper) {
  th:nth-child(3n) {
    width: 24%;
  }
}
</style>
