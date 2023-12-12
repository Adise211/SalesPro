<template>
  <v-container fluid class="calendar-page">
    <v-row>
      <v-col md="6" v-if="!isOnEditCalendarMode">
        <ViewCards>
          <template v-slot:card-title>Events: </template>
          <template v-slot:card-sub-title>date </template>
          <template v-slot:card-text>description </template>
        </ViewCards>
      </v-col>
      <v-col md="6" v-if="isOnEditCalendarMode">
        <ViewCards>
          <template v-slot:card-title>Create New Event </template>
          <!-- <template v-slot:card-sub-title>date </template> -->
          <template v-slot:card-text>
            <v-form>
              <!-- Selected date -->
              <v-text-field
                v-model="selectedDate"
                label="Date"
                variant="outlined"
                readonly
                disabled
                density="compact"
                style="width: 50%"
                color="primary"
              ></v-text-field>
              <!-- Company's name -->
              <v-text-field
                label="Company"
                variant="outlined"
                density="compact"
                style="width: 50%"
                color="primary"
              ></v-text-field>
              <!-- Color pick -->
              <v-select
                v-model="pickedColor"
                variant="outlined"
                density="comfortable"
                label="Event Color"
                style="width: 50%"
                color="primary"
                :items="eventColors"
                :item-value="title"
                :item-title="title"
                chips
              >
                <template v-slot:chip="{ item }">
                  <v-chip variant="flat" :color="showPickedColor" v-if="pickedColor">
                    <p>{{ item.title }}</p>
                  </v-chip>
                </template>
              </v-select>
              <!-- Participants -->
              <v-text-field
                label="Participants"
                variant="outlined"
                density="compact"
                style="width: 50%"
                color="primary"
              ></v-text-field>
              <!-- Event description -->
              <v-textarea label="Description" variant="outlined" color="primary"></v-textarea>
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
    isOnEditCalendarMode: true,
    selectedDate: "",
    pickedColor: "",
    currentEventObject: {},
    calendarAttrs: [
      {
        highlight: {
          color: "purple",
          fillMode: "light"
        },
        // dot: "red",
        dates: new Date()
      }
    ]
  }),
  created() {},
  mounted() {},
  methods: {
    dayClickHandler(calendar) {
      this.selectedDate = calendar.id;
      console.log("clicked on day...", this.selectedDate);
    }
  },
  computed: {
    eventColors() {
      return [
        { title: "grey", color: "#475569" },
        { title: "red", color: "#dc2626" },
        { title: "orange", color: "#ea580c" },
        { title: "yellow", color: "#ca8a04" },
        { title: "green", color: "#16a34a" },
        { title: "teal", color: "#0d9488" },
        { title: "blue", color: "#2563eb" },
        { title: "indigo", color: "#4f46e5" },
        { title: "purple", color: "#9333ea" },
        { title: "pink", color: "#db2777" }
      ];
    },
    showPickedColor() {
      let currentColor;
      if (this.pickedColor) {
        const isColorExist = this.eventColors.find((item) => {
          return this.pickedColor === item.title;
        });
        currentColor = isColorExist ? isColorExist.color : "";
      } else {
        currentColor = "";
      }

      return currentColor;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
