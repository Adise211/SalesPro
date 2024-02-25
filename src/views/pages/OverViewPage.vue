<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6">
        <DisplayCalendar
          :selectedDate="selectedDate"
          @onEditEvent="
            (val) => {
              editEventItem = val;
            }
          "
        ></DisplayCalendar>
      </v-col>

      <v-col md="6">
        <AppCard>
          <template v-slot:card-text> </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import DisplayCalendar from "@/components/DisplayCalendar.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "@/stores/calendar";

export default {
  name: "CalendarPage",
  components: { AppCard, DisplayCalendar },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    ...mapState(useCalendarStore, ["eventsGroupsAttr"])
  },
  watch: {}
};
</script>

<style scoped></style>
