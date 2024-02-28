<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="12">
        <AppCard :cardTextClass="'fill-height pa-0'">
          <template v-slot:card-text>
            <div id="full-calendar"></div>
          </template>
        </AppCard>
      </v-col>
    </v-row>
    <AppEventDialog
      :isParentReqToOpen="isEventDialogOpen"
      @onDialogClose="onEventDialogClose"
    ></AppEventDialog>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import AppEventDialog from "@/components/AppEventDialog.vue";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { createCalendar, viewMonthGrid } from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import "@schedule-x/theme-default/dist/index.css";

export default {
  name: "CalendarPage",
  components: { AppCard, AppEventDialog },
  props: {},
  data: () => ({
    isEventDialogOpen: false
  }),
  created() {},
  mounted() {
    // Add the events from store into config
    this.calendarConfig.events = this.calendarEvents;

    const activeCalendar = createCalendar(this.calendarConfig);
    activeCalendar.render(document.getElementById("full-calendar"));
    // Create and add custom button to calendar
    this.addNewBtnInCalendar();
  },
  methods: {
    addNewBtnInCalendar() {
      // Get calendar header
      const calendarHeader = document.getElementsByClassName("sx__calendar-header")[0];
      // Get last child in calendar header
      const lastChild = calendarHeader.lastChild;
      // Create new button with attr, class and event listener
      const newBtn = document.createElement("button");
      newBtn.innerText = "Add event";
      newBtn.setAttribute("type", "button");
      newBtn.classList.add("calendar-add-event-btn");
      newBtn.addEventListener("click", () => {
        this.createNewEvent();
      });

      // Insert the button before the last child
      calendarHeader.insertBefore(newBtn, lastChild);
    },
    createNewEvent() {
      this.isEventDialogOpen = true;
    },
    onEventDialogClose() {
      this.isEventDialogOpen = false;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["calendarEvents"]),
    calendarConfig() {
      // const vueInstance = this;
      return {
        views: [viewMonthGrid],
        events: [
          {
            id: 1,
            title: "Coffee with John",
            start: "2024-02-26 10:05",
            end: "2024-02-26 10:35"
          }
        ],
        plugins: [createEventModalPlugin()],
        callbacks: {
          onClickDate() {
            // console.log("onClickDate", date);
          }
        }
      };
    }
  },
  watch: {}
};
</script>

<style scoped></style>
