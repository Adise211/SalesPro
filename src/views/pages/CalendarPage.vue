<template>
  <v-container fluid class="calendar-page">
    <v-row>
      <v-col md="6" v-if="!editCalendar">
        <ViewCards>
          <template v-slot:card-title>Events: </template>
          <template v-slot:card-sub-title>date </template>
          <template v-slot:card-text>description </template>
        </ViewCards>
      </v-col>
      <v-col md="6" v-if="editCalendar">
        <ViewCards>
          <template v-slot:card-title>Create New Event </template>
          <!-- <template v-slot:card-sub-title>date </template> -->
          <template v-slot:card-text>
            <v-form>
              <v-text-field
                v-model="editCalendar"
                label="Date"
                variant="outlined"
                readonly
                disabled
                density="compact"
                style="width: 50%"
              ></v-text-field>
              <v-select variant="outlined" density="compact" style="width: 50%"></v-select>
              <v-text-field
                label="Participants"
                variant="outlined"
                density="compact"
                style="width: 50%"
              ></v-text-field>
              <v-textarea label="Description" variant="outlined"></v-textarea>
            </v-form>
          </template>
        </ViewCards>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <Calendar
              borderless
              transparent
              :attributes="calendarAttrs"
              expanded
              @dayclick="dayClickHandler"
            />
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
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
    ],
    editCalendar: true
  }),
  created() {},
  mounted() {},
  methods: {
    dayClickHandler() {
      console.log("clicked on day...");
    }
  },
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
