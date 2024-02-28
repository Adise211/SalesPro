<template>
  <div class="d-flex flex-column fill-height">
    <AppCard class="view-events-details" :cardTextClass="'fill-height'">
      <template v-slot:card-text> </template>
    </AppCard>
    <AppCard class="view-events-list mt-3">
      <template v-slot:card-title>Week list</template>
      <template v-slot:card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="tableItems"
          height="160px"
          :items-per-page="itemsPerPage"
        >
          <!-- table body (items) -->
          <template v-slot:item="{ item }">
            <tr>
              <td class="text-medium-emphasis">{{ item.EventDate }}</td>
              <td class="text-medium-emphasis">{{ item.Company }}</td>
              <td>
                <v-chip :color="item.Status === weekListStatus.Done ? 'green' : 'gray'">
                  {{ item.Status }}
                </v-chip>
              </td>
            </tr>
          </template>
          <!-- table footer (paging) -->
          <template v-slot:bottom>
            <div class="text-center pt-2" v-if="tableItems?.length">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </template>
        </v-data-table>
      </template>
    </AppCard>
  </div>
</template>

<script>
// @ts-ignore
import AppCard from "./AppCard.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "../stores/calendar";
import moment from "moment";

export default {
  components: { AppCard },
  props: {
    selectedDate: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    currentIndex: 0,
    page: 1,
    itemsPerPage: 5
  }),
  created() {},
  mounted() {},
  methods: {
    onNextBtnClick() {
      if (this.currentIndex < this.currentEvents.length) {
        // not the last index - move to the next event
        this.currentIndex = this.currentIndex + 1;
      }
    },
    onPreviousBtnClick() {
      const isTheFisrtIndex = this.currentIndex === 0;
      if (!isTheFisrtIndex) {
        // not the first index - back to previous event
        this.currentIndex = this.currentIndex - 1;
      }
    }
  },
  computed: {
    ...mapState(useCalendarStore, ["userEventsList"]),
    currentEvents: function () {
      const eventsList = this.userEventsList.filter((item) => {
        return item.EventDate === this.selectedDate;
      });
      return eventsList || [];
    },
    tableHeaders: function () {
      return [
        {
          title: "Date",
          key: "EventDate"
        },
        {
          title: "Company",
          key: "Company"
        },
        {
          title: "Status",
          key: "status"
        }
      ];
    },
    tableItems: function () {
      let result;
      // get current week events
      const currentWeekEvents = this.userEventsList.filter((item) => {
        if (this.weekRange.dayFirst <= item.EventDate && item.EventDate <= this.weekRange.dayLast) {
          return item;
        }
      });
      if (currentWeekEvents.length > 0) {
        result = currentWeekEvents.map((cwe) => {
          const today = moment(new Date()).format("YYYY-MM-DD");
          const { EventDate, Company } = cwe;
          const eventStatus =
            today < EventDate ? this.weekListStatus.Soon : this.weekListStatus.Done;
          return {
            EventDate,
            Company,
            Status: eventStatus
          };
        });
      }
      return result;
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
    },
    weekRange: function () {
      return {
        dayFirst: moment(new Date()).startOf("week").format("YYYY-MM-DD"),
        dayLast: moment(new Date()).endOf("week").format("YYYY-MM-DD")
      };
    },
    weekListStatus: function () {
      return {
        Done: "Done",
        Soon: "Soon"
      };
    }
  },
  watch: {
    selectedDate: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          // different date - reset current index
          this.currentIndex = 0;
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
