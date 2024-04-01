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
    activeCalendar: null,
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
    createNewEvent() {
      this.isEventDialogOpen = true;
    },
    onEventDialogClose() {
      this.isEventDialogOpen = false;
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["calendarEvents"])
  },
  watch: {}
};
</script>

<style scoped></style>
