<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="12">
        <ViewCards cardTextFillHeight>
          <template v-slot:card-text>
            <div></div>
            <div id="full-calendar"></div>
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import { mapState } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import "v-calendar/style.css";
import { createCalendar, viewMonthGrid } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";

export default {
  name: "CalendarPage",
  components: { ViewCards },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {
    const activeCalendar = createCalendar(this.calendarConfig);
    activeCalendar.render(document.getElementById("full-calendar"));
    this.addBtnInCalendar();
  },
  methods: {
    addBtnInCalendar() {
      const calendarHeader = document.getElementsByClassName("sx__calendar-header")[0];
      const lastChild = calendarHeader.lastChild;

      console.log("firstChild:", lastChild);
      const newBtn = document.createElement("button");
      newBtn.innerText = "Add event";
      newBtn.setAttribute("type", "button");
      newBtn.classList.add("calendar-add-event-btn");
      newBtn.addEventListener("click", () => {
        alert("creating new event!");
      });
      calendarHeader.insertBefore(newBtn, lastChild);
    }
  },
  computed: {
    ...mapState(useCalendarStore, ["eventsGroupsAttr"]),
    calendarConfig() {
      const vueInstance = this;
      return {
        views: [viewMonthGrid],
        events: [
          {
            id: 1,
            title: "Coffee with John",
            start: "2023-12-04 10:05",
            end: "2023-12-04 10:35"
          }
        ],
        callbacks: {
          onClickDate(date) {
            // console.log("onClickDate", date);
            vueInstance.testOnClickDate(date);
          }
        }
      };
    }
  },
  watch: {}
};
</script>

<style scoped></style>
