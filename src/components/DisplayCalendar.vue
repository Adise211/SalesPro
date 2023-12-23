<template>
  <ViewCards withActions class="view-events-details">
    <template v-slot:card-title>Events:</template>
    <template v-slot:card-text>
      <div v-if="currentEvents.length > 0">
        <v-row>
          <v-col>
            <div>Date</div>
            <span class="text-medium-emphasis">{{ selectedDate }}</span>
            <div class="mt-4">Company</div>
            <span class="text-medium-emphasis">{{ currentEvents[currentIndex].Company }}</span>
            <div class="mt-4">Participants</div>
            <span class="text-medium-emphasis">{{ currentEvents[currentIndex].Participants }}</span>
          </v-col>
          <v-col>
            <div class="mt-4">Description</div>
            <span class="text-medium-emphasis">{{ currentEvents[currentIndex].Description }}</span>
          </v-col>
        </v-row>
      </div>
      <div v-else>No events</div>
    </template>
    <template v-slot:card-actions v-if="currentEvents.length > 0">
      <div class="pb-1 d-flex flex-row justify-space-between" style="width: 100%">
        <v-btn
          color="primary"
          class="font-weight-bold"
          @click="onPreviousBtnClick"
          :disabled="currentEvents.length < 2 || currentIndex === 0"
          >Previous</v-btn
        >
        <v-btn
          class="app-orange-color font-weight-bold"
          @click="onNextBtnClick"
          :disabled="currentEvents.length < 2 || currentIndex === currentEvents.length - 1"
          >Next</v-btn
        >
      </div>
    </template>
  </ViewCards>
  <ViewCards class="view-events-list mt-3">
    <template v-slot:card-title>List:</template>
    <template v-slot:card-text>
      <v-data-table :headers="tableHeaders"> </v-data-table>
    </template>
  </ViewCards>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "../stores/calendar";

export default {
  components: { ViewCards },
  props: {
    selectedDate: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    currentIndex: 0
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
