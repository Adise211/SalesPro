<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="12">
        <ViewCards>
          <template v-slot:card-text> </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import { CalendarPageMode } from "@/utilities/consts";
import "v-calendar/style.css";

export default {
  name: "CalendarPage",
  components: { ViewCards },
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
