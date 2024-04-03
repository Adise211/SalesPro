<template>
  <v-container fluid class="calendar-page fill-height py-0">
    <v-row class="fill-height">
      <v-col md="12">
        <AppCard :cardTextClass="'fill-height'">
          <template v-slot:card-text>
            <div id="full-calendar"></div>
          </template>
        </AppCard>
      </v-col>
    </v-row>
    <AppEventDialog
      :isDialogOpen="isEventDialogOpen"
      @onDialogClose="isEventDialogOpen = false"
    ></AppEventDialog>
    <!-- Event popup -->
    <v-card
      v-if="selectedEvent && selectedEvent.el"
      class="selected-event-popover"
      elevation="16"
      v-click-outside="onPopoverOutsideClick"
      :style="{
        top: selectedEventPopoverPosition.top + 'px',
        left: selectedEventPopoverPosition.left + 'px'
      }"
    >
      <v-card-title>{{ selectedEvent.event.title }}</v-card-title>

      <v-card-text class="mt-2">
        <div>
          <span class="mr-1"><v-icon icon="mdi-clock-outline" color="primary"></v-icon></span>
          {{ formattedEventDate }}
        </div>
        <div class="mt-2">
          <span class="mr-1"><v-icon icon="mdi-map-marker" color="primary"></v-icon></span>
          {{ selectedEvent.appEvent.location }}
        </div>
        <div class="mt-2">
          <span class="mr-1"><v-icon icon="mdi-account-multiple" color="primary"></v-icon></span>
          {{ selectedEvent.appEvent.people[0] }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text">Edit</v-btn>
        <v-btn variant="text" @click="selectedEvent = null">Close</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import AppEventDialog from "@/components/AppEventDialog.vue";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { convertDate } from "@/utilities/utilsFuncs";
import moment from "moment";
const FullCalendar = window.FullCalendar;

export default {
  name: "CalendarPage",
  components: { AppCard, AppEventDialog },
  props: {},
  data: () => ({
    activeCalendar: null,
    isEventDialogOpen: false,
    selectedEvent: null,
    selectedEventPopoverPosition: {
      top: 0,
      left: 0
    }
  }),
  created() {},
  mounted() {
    const vueInstance = this;

    // in timeout for the height prop
    setTimeout(() => {
      var calendarEl = document.getElementById("full-calendar");
      this.activeCalendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "dayGridMonth",
        height: "100%",
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
          dayGridMonth: {
            dayMaxEventRows: 2
          }
        },
        customButtons: {
          addEventButton: {
            text: "Add Event",
            click: () => {
              vueInstance.isEventDialogOpen = true;
            }
          }
        },
        headerToolbar: {
          left: "title",
          center: "addEventButton",
          right: "today prev,next dayGridMonth,timeGridWeek,timeGridDay"
        },
        events: vueInstance.calendarEvents,
        eventClick: (eventInfo) => vueInstance.calendarEventClickHandler(eventInfo)
      });

      this.activeCalendar.render();
    }, 100);
  },
  methods: {
    onEventDialogClose() {
      this.isEventDialogOpen = false;
    },
    calendarEventClickHandler(eventInfo) {
      // get the clicked el
      let element = eventInfo.jsEvent.target;
      // get the position relative to the viewport
      let elementPositionTop = element.getBoundingClientRect().top;
      let elementPositionLeft = element.getBoundingClientRect().right;
      // set the popover position
      this.selectedEventPopoverPosition.top = elementPositionTop;
      this.selectedEventPopoverPosition.left = elementPositionLeft;

      const appSavedEventInfo = this.calendarEvents.find((oneEv) => {
        return oneEv.id === eventInfo.event.id;
      });

      this.selectedEvent = { ...eventInfo, appEvent: appSavedEventInfo };
    },
    onPopoverOutsideClick() {
      this.selectedEvent = null;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["calendarEvents"]),
    formattedEventDate() {
      let date = "";
      let dateFormatType = "";
      if (this.selectedEvent) {
        const { start, end } = this.selectedEvent.appEvent;
        // choose date format (with times/without times)
        dateFormatType = this.selectedEvent.appEvent.allDay ? "MDYFormat" : "FullDateWithTime";

        // check if it's one full day or not
        date = moment(start).isSame(end, "day")
          ? convertDate(start)[dateFormatType] + " - " + "all day"
          : convertDate(start)[dateFormatType] + " - " + convertDate(end)[dateFormatType];
      }
      return date;
    }
  },
  watch: {}
};
</script>

<style scoped>
.selected-event-popover {
  position: absolute;
  z-index: 9999;
}
</style>
