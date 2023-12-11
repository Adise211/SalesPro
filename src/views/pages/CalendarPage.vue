<template>
  <c-container fluid class="calendar-page">
    <v-row>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-title>Events: </template>
          <template v-slot:card-sub-title>date </template>
          <template v-slot:card-text>description </template>
        </ViewCards>
      </v-col>

      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <Calendar borderless transparent :attributes="calendarAttrs" expanded />
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </c-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import { Calendar } from "v-calendar";
import "v-calendar/style.css";

export default {
  name: "CalendarPage",
  components: { ViewCards, Calendar },
  props: {},
  data: () => ({
    calendarAttrs: [
      {
        highlight: {
          color: "purple",
          fillMode: "light"
        },
        dates: new Date()
      }
    ]
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
