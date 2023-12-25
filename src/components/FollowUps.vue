<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col md="6">
        <!-- Charts -->
        <ViewCards>
          <template v-slot:card-text>
            <!-- <AppCharts></AppCharts> -->
          </template>
        </ViewCards>
      </v-col>
      <v-col md="6">
        <!-- List -->
        <ViewCards :cardHeight="580">
          <template v-slot:card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="tableItems"
              :items-per-page="itemsPerPage"
              :height="450"
            >
              <!-- table body (items) -->
              <template v-slot:item="{ item }">
                <tr>
                  <td class="text-medium-emphasis">{{ item.Company }}</td>
                  <td class="text-medium-emphasis">{{ item.LastUpdate }}</td>
                  <td>
                    <!-- <v-chip :color="item.Status === weekListStatus.Done ? 'green' : 'gray'">
                {{ item.Status }}
              </v-chip> -->
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
  </v-container>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";
import moment from "moment";

export default {
  name: "FollowUps",
  components: { ViewCards },
  props: {},
  data: () => ({
    itemsPerPage: "5",
    page: 1
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "Company"
        },
        {
          title: "Last update",
          key: "LastUpdate"
        },
        {
          title: "",
          key: "ChangeLevel"
        }
      ];
    },
    tableItems() {
      return [
        {
          Company: "Amazon",
          LastUpdate: `${moment(new Date()).format("YYYY-MM-DD")}`
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
