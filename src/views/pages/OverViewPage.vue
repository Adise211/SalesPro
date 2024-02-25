<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="6" v-if="isOnEditCalendarMode">
        <DisplayCalendar
          :selectedDate="selectedDate"
          @onEditEvent="
            (val) => {
              editEventItem = val;
            }
          "
        ></DisplayCalendar>
      </v-col>
      <v-col md="6" v-if="!isOnEditCalendarMode">
        <EditCalendar :selectedDate="selectedDate" :editEventItem="editEventItem"></EditCalendar>
      </v-col>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <Calendar
              ref="vcalendar"
              class="app-full-calendar"
              borderless
              transparent
              :attributes="calendarAttrs"
              expanded
              @dayclick="dayClickHandler"
            >
              <template v-slot:footer>
                <div class="w-25 ml-auto mr-auto">
                  <v-btn class="w-100" color="primary" variant="flat" @click="moveToToday"
                    >Today</v-btn
                  >
                </div>
              </template>
            </Calendar>
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import DisplayCalendar from "@/components/DisplayCalendar.vue";
import EditCalendar from "@/components/EditCalendar.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import { Calendar } from "v-calendar";
import { CalendarPageMode } from "@/utilities/consts";
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
    editEventItem: null,
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
    },
    moveToToday() {
      if (this.$refs?.vcalendar) {
        this.$refs.vcalendar.move(new Date());
      }
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
