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
      :selectedEvent="selectedEvent"
      @onDialogClose="onEventDialogClose"
    ></AppEventDialog>
    <!-- Event popup -->
    <v-card
      v-if="isEventPopoverOpen && selectedEvent && selectedEvent.el"
      class="selected-event-popover"
      width="350px"
      max-height="300px"
      elevation="16"
      v-click-outside="closeEventPopover"
      :style="{
        top: selectedEventPopoverPosition.top + 'px',
        left: selectedEventPopoverPosition.left + 'px'
      }"
    >
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-truncate" style="max-width: 80%">{{ selectedEvent.event.title }}</span>
        <v-icon size="small" color="primary" @click="onEditEventClick"
          >mdi-square-edit-outline</v-icon
        >
      </v-card-title>

      <v-card-text class="mt-2">
        <div
          v-for="(detail, index) in eventDetailsForDisplay"
          :key="index"
          class="text-truncate"
          :class="{ 'mt-3': index != 0 }"
        >
          <span class="mr-2 font-weight-bold">{{ detail.title }}:</span>
          <span>{{ detail.value }}</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          color="error"
          @click="onDeleteEventClick"
          :loading="isDeleteLoaderActive"
          >Delete</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import AppEventDialog from "@/components/AppEventDialog.vue";
import { mapActions, mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { convertDate } from "@/utilities/utilsFuncs";
import { ToastMessages } from "@/utilities/consts";
import { removeCalendarEvent } from "@/firebase/services/data";
import moment from "moment";
const FullCalendar = window.FullCalendar;

export default {
  name: "CalendarPage",
  components: { AppCard, AppEventDialog },
  props: {},
  data: () => ({
    activeCalendar: null,
    isEventDialogOpen: false,
    isEventPopoverOpen: false,
    selectedEvent: null,
    selectedEventPopoverPosition: {
      top: 0,
      left: 0
    },
    isDeleteLoaderActive: false
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
    ...mapActions(useGeneralStore, ["removeCalendarEventFromStore", "setToastMessage"]),
    onEventDialogClose() {
      this.isEventDialogOpen = false;
      this.selectedEvent = null;
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
      this.isEventPopoverOpen = true;
    },
    closeEventPopover() {
      this.isEventPopoverOpen = false;
    },
    onEditEventClick() {
      this.isEventDialogOpen = true;
      this.closeEventPopover();
    },
    async onDeleteEventClick() {
      this.isDeleteLoaderActive = true;
      const response = await removeCalendarEvent(this.selectedEvent.appEvent);
      if (response.Result.Success) {
        // Show success toast
        this.setToastMessage({
          type: "success",
          message: ToastMessages.SuccessMessages.Removed
        });
        // Add to store and reset
        this.removeCalendarEventFromStore(this.selectedEvent.appEvent);
        this.onEventDialogClose();
        this.closeEventPopover();
      }
      this.isDeleteLoaderActive = false;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["calendarEvents"]),
    formattedEventDate() {
      let date = "";
      if (this.selectedEvent) {
        const { start, end } = this.selectedEvent.appEvent;
        // check if it's full day or not
        date = moment(start).isSame(end, "day")
          ? convertDate(start).MDYFormat + " - " + "All day"
          : convertDate(start).MDYFormat + " - " + convertDate(end).MDYFormat;
      }
      return date;
    },
    eventPerticipants() {
      return this.selectedEvent?.appEvent?.people?.join() || "";
    },
    eventDetailsForDisplay() {
      return [
        {
          title: "Date",
          value: this.formattedEventDate
        },
        {
          title: "Location",
          value: this.selectedEvent.appEvent.location
        },
        {
          title: "Perticipants",
          value: this.eventPerticipants
        },
        {
          title: "Description",
          value: this.selectedEvent.appEvent.description
        },
        {
          title: "Company",
          value: this.selectedEvent.appEvent.description
        }
      ];
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
