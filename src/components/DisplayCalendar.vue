<template>
  <ViewCards withActions>
    <template v-slot:card-title>Events:</template>
    <template v-slot:card-text>
      <div v-if="currentEvents.length > 0">
        <v-row>
          <v-col>
            <div>Date</div>
            <span class="text-medium-emphasis">{{ selectedDate }}</span>
            <div class="mt-4">Company</div>
            <span class="text-medium-emphasis">{{ currentEvents[0].Company }}</span>
            <div class="mt-4">Participants</div>
            <span class="text-medium-emphasis">{{ currentEvents[0].Participants }}</span>
          </v-col>
          <v-col>
            <div class="mt-4">Description</div>
            <span class="text-medium-emphasis">{{ currentEvents[0].Description }}</span>
          </v-col>
        </v-row>
      </div>
      <div v-else>No events</div>
    </template>
    <template v-slot:card-actions v-if="currentEvents.length > 0">
      <div class="pb-1 d-flex flex-row justify-space-between" style="width: 100%">
        <v-btn color="primary" class="font-weight-bold">Previous</v-btn>
        <v-btn class="app-orange-color font-weight-bold">Next</v-btn>
      </div>
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
    currentIndex: -1
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    ...mapState(useCalendarStore, ["userEventsList"]),
    currentEvents: function () {
      const eventsList = this.userEventsList.filter((item) => {
        return item.EventDate === this.selectedDate;
      });
      return eventsList || [];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
