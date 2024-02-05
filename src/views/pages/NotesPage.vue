<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6">
        <div class="d-flex flex-column fill-height">
          <ViewCards class="view-notes">
            <template v-slot:card-text>
              <div>View note (by id)</div>
            </template>
          </ViewCards>
          <ViewCards class="create-notes mt-3" cardTextFillHeight>
            <template v-slot:card-text>
              <div class="fill-height d-flex flex-column">
                <v-form>
                  <!-- Reffer To -->
                  <v-autocomplete
                    :items="companiesList"
                    item-title="Company"
                    item-value="Company"
                    placeholder="Reffer to"
                    variant="outlined"
                    density="compact"
                    color="primary"
                    style="max-width: 50%"
                  >
                  </v-autocomplete>
                  <!-- Note Description -->
                  <v-textarea
                    v-model="noteDescription"
                    placeholder="Type here..."
                    variant="outlined"
                    color="primary"
                    rows="2"
                  >
                  </v-textarea>
                </v-form>
                <!-- Action Buttons -->
                <div class="mt-auto mb-3">
                  <v-btn class="mr-2" variant="flat" color="primary">Save</v-btn>
                  <v-btn variant="outlined" color="primary">Clear</v-btn>
                </div>
              </div>
            </template>
          </ViewCards>
        </div>
      </v-col>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <v-text-field
              v-model="searchExpression"
              placeholder="Search"
              variant="outlined"
              density="compact"
              color="primary"
              style="max-width: 50%"
            >
            </v-text-field>
            <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              :items-per-page="itemsPerPage"
              :height="415"
              :page="page"
              :search="searchExpression"
            >
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
import { mapState } from "pinia";
import { useGeneralStore } from "../../stores/general";
import moment from "moment";

export default {
  name: "NotesPage",
  components: { ViewCards },
  props: {},
  data: () => ({
    page: 1,
    itemsPerPage: "6",
    searchExpression: "",
    noteDescription: ""
  }),
  created() {},
  mounted() {},
  methods: {},
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
    }
  },
  watch: {}
};
</script>

<style scoped></style>
