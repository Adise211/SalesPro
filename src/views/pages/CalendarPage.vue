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
    <!-- Event popup -->
    <v-dialog
      :target="targetEventEl"
      v-model="showEventPopup"
      location-strategy="connected"
      :scrim="false"
      width="300"
      transition="scroll-x-reverse-transition"
      location="left"
      :offset="[180, 10]"
    >
      <v-card v-if="selectedEvent">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-truncate" style="max-width: 80%">{{ selectedEvent.event.title }}</span>
          <v-icon size="small" color="primary" @click="onEditEventClick"
            >mdi-square-edit-outline</v-icon
          >
        </v-card-title>

        <v-card-text>
          <div
            v-for="(detail, index) in eventDetailsForDisplay"
            :key="index"
            class="text-medium-emphasis text-truncate text-body-2"
            :class="{ 'mt-2': index != 0 }"
          >
            <span class="mr-2">{{ detail.title }}:</span>
            <span>{{ detail.value }}</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="error"
            @click="onDeleteEventClick"
            :loading="isDeleteLoaderActive"
            >Delete</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Create/Update event dialog -->
    <AppEventDialog
      :isDialogOpen="isEventDialogOpen"
      :selectedEvent="selectedEvent"
      @addNewEvent="addNewEventToFC"
      @onDialogClose="onEventDialogClose"
    ></AppEventDialog>
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
    selectedEvent: null,
    isDeleteLoaderActive: false,
    targetEventEl: "",
    showEventPopup: false
    // selectedEventPopoverPosition: {
    //   top: 0,
    //   left: 0
    // },
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
    calendarEventClickHandler(eventInfo) {
      // get the clicked el
      let element = eventInfo.jsEvent.target;
      this.targetEventEl = element;
      this.showEventPopup = true;

      // get the position relative to the viewport
      // let elementPositionTop = element.getBoundingClientRect().top;
      // let elementPositionLeft = element.getBoundingClientRect().right;
      // // set the popover position
      // this.selectedEventPopoverPosition.top = elementPositionTop;
      // this.selectedEventPopoverPosition.left = elementPositionLeft;

      const appSavedEventInfo = this.calendarEvents.find((oneEv) => {
        return oneEv.id === eventInfo.event.id;
      });

      this.selectedEvent = { ...eventInfo, appEvent: appSavedEventInfo };
    },
    onEventDialogClose() {
      this.isEventDialogOpen = false;
      this.selectedEvent = null;
    },
    closeEventPopup() {
      this.showEventPopup = false;
    },
    onEditEventClick() {
      this.isEventDialogOpen = true;
      this.closeEventPopup();
    },
    addNewEventToFC(val) {
      // Add to Fullcalendar component:
      // https://fullcalendar.io/docs/Calendar-addEvent
      this.activeCalendar.addEvent(val);
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
        this.closeEventPopup();
        // Remove from Fullcalendar component:
        // https://fullcalendar.io/docs/Event-remove
        this.selectedEvent.event.remove();
      }
      this.isDeleteLoaderActive = false;
      this.selectedEvent = null;
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
          title: "Description",
          value: this.selectedEvent.appEvent.description
        },
        {
          title: "Perticipants",
          value: this.eventPerticipants
        },
        {
          title: "Company",
          value: this.selectedEvent.appEvent.description
        },
        {
          title: "Location",
          value: this.selectedEvent.appEvent.location
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
