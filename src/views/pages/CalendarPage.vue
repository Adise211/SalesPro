<template>
  <v-container fluid class="calendar-page">
    <v-row>
      <v-col md="6" v-if="!isOnEditCalendarMode">
        <DisplayCalendar :selectedDate="selectedDate"></DisplayCalendar>
      </v-col>
      <v-col md="6" v-if="isOnEditCalendarMode">
        <EditCalendar :selectedDate="selectedDate"></EditCalendar>
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
import DisplayCalendar from "../../components/DisplayCalendar.vue";
// @ts-ignore
import EditCalendar from "../../components/EditCalendar.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "../../stores/calendar";
import { Calendar } from "v-calendar";
import { CalendarPageMode } from "../../utilities/consts";
import "v-calendar/style.css";

export default {
  name: "CalendarPage",
  components: { ViewCards, Calendar, DisplayCalendar, EditCalendar },
  props: {
    calendarMode: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    isOnEditCalendarMode: true,
    selectedDate: "",
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
  methods: {
    dayClickHandler(calendar) {
      this.selectedDate = calendar.id;
    }
  },
  computed: {
    ...mapState(useCalendarStore, ["eventsGroupsAttr"])
  },
  watch: {
    calendarMode: {
      handler(newVal) {
        if (newVal === CalendarPageMode.View) {
          this.isOnEditCalendarMode = false;
        } else if (newVal === CalendarPageMode.Edit) {
          this.isOnEditCalendarMode = true;
        }
      },
      immediate: true
    },
    eventsGroupsAttr: {
      handler(newData) {
        if (newData?.length) {
          newData.map((group) => {
            const eventsForDisplay = {
              dot: group.dot,
              dates: group.dates.map((date) => new Date(date.EventDate))
            };
            this.calendarAttrs.push(eventsForDisplay);
          });
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
