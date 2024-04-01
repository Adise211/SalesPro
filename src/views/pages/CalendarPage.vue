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
      :isParentReqToOpen="isEventDialogOpen"
      @onDialogClose="isEventDialogOpen = false"
    ></AppEventDialog>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import AppEventDialog from "@/components/AppEventDialog.vue";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
const FullCalendar = window.FullCalendar;

export default {
  name: "CalendarPage",
  components: { AppCard, AppEventDialog },
  props: {},
  data: () => ({
    isEventDialogOpen: false
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
        customButtons: {
          addEventButton: {
            text: "add event...",
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
        events: vueInstance.calendarEvents
      });

      this.activeCalendar.render();
    }, 100);
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
    ...mapState(useGeneralStore, ["calendarEvents"])
    // calendarConfig() {
    //   // const vueInstance = this;
    //   return {
    //     views: [viewMonthGrid],
    //     events: [
    //       {
    //         id: 1,
    //         title: "Coffee with John",
    //         start: "2024-02-26 10:05",
    //         end: "2024-02-26 10:35"
    //       }
    //     ],
    //     plugins: [createEventModalPlugin()],
    //     callbacks: {
    //       onClickDate() {
    //         // console.log("onClickDate", date);
    //       }
    //     }
    //   };
    // }
  },
  watch: {}
};
</script>

<style scoped></style>
