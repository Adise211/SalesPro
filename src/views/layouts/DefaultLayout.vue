<template>
  <div class="default-layout">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer color="blue-grey-darken-4" persistent>
        <v-list>
          <v-list-item
            class="py-5"
            :title="userFullName"
            :subtitle="userEmail"
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-group value="Meetings" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Meetings"></v-list-item>
            </template>
            <v-list-item
              link
              title="Calendar"
              variant="tonal"
              append-icon="mdi-calendar"
              @click="onNavItemClick('Calendar')"
            >
            </v-list-item>
            <v-list-item
              link
              title="Create Event"
              variant="tonal"
              append-icon="mdi-calendar-edit"
              @click="onNavItemClick('CreateEvent')"
            ></v-list-item>
          </v-list-group>
          <v-list-item link title="Notes" @click="onNavItemClick('Notes')"></v-list-item>
          <v-list-group value="Tracking" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Tracking"></v-list-item>
            </template>
            <v-list-item
              link
              title="Follow ups"
              variant="tonal"
              append-icon="mdi-run"
              @click="onNavItemClick('FolllowUps')"
            ></v-list-item>
            <v-list-item
              link
              title="Leads"
              variant="tonal"
              append-icon="mdi-fire"
              @click="onNavItemClick('Leads')"
            ></v-list-item>
            <v-list-item
              link
              title="Closed"
              variant="tonal"
              append-icon="mdi-handshake"
              @click="onNavItemClick('Closed')"
            ></v-list-item>
          </v-list-group>
          <v-list-item
            link
            title="Extract From Files"
            @click="onNavItemClick('ExtractFiles')"
          ></v-list-item>
          <v-list-item link title="Settings" @click="onNavItemClick('Settings')"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="primary" @click="onLogout"> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar color="blue-grey-darken-4" flat title="SalesPro"> </v-app-bar>

      <v-main class="main-content">
        <slot></slot>
      </v-main>
    </v-layout>
    <!-- Reminder Alert Dialog -->
    <v-dialog v-if="noteReminder" v-model="isReminderDialogOpen" width="500">
      <v-card>
        <!-- <v-toolbar color="#eab308" class="px-2 text-h5 text-white" height="56" elevation="3"
          >Reminder</v-toolbar
        > -->
        <v-card-title class="text-h5 font-weight-medium">Reminder</v-card-title>
        <v-card-text>
          <div>
            <div>
              Reffer to:
              <span class="text-medium-emphasis">{{ noteReminder.CompanyName }}</span>
            </div>
            <div>
              Date: <span class="text-medium-emphasis">{{ noteReminder.SelectedDate }}</span>
            </div>
            <div>
              Time: <span class="text-medium-emphasis">{{ noteReminder.SelectedTime }}</span>
            </div>
            <div class="text-center">{{ noteReminder.NoteDescription }}</div>
          </div>
        </v-card-text>
        <v-card-actions class="d-flex justify-center align-center">
          <v-btn variant="flat" color="primary" @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { NavigationItems, CalendarPageMode, TrackingStages } from "../../utilities/consts";
import { mapState } from "pinia";
import { useGeneralStore } from "../../stores/general";
import { useCalendarStore } from "../../stores/calendar";
import { logoutUser } from "../../firebase/services/user";
// import { updateNote } from "../../firebase/services/data";
import Config from "../../utilities/config";
import { convertTime } from "../../utilities/utilsFuncs";
// import moment from "moment";
let checkUserActivityInterval;

export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({
    isReminderDialogOpen: false
  }),
  created() {},
  mounted() {
    // Check if user is still active (interval)
    checkUserActivityInterval = setInterval(
      this.sessionExparationHandler(),
      convertTime(Config.session.userActivityCheckInterval).miliseconds
    );
  },
  unmounted() {
    clearInterval(checkUserActivityInterval);
  },
  methods: {
    onNavItemClick(itemName) {
      let pageName;
      let paramsObj;
      switch (itemName) {
        case NavigationItems.Calendar:
          pageName = "CalendarPage";
          paramsObj = { calendarMode: CalendarPageMode.View };
          break;
        case NavigationItems.CreateEvent:
          pageName = "CalendarPage";
          paramsObj = { calendarMode: CalendarPageMode.Edit };
          break;
        case NavigationItems.Notes:
          pageName = "NotesPage";
          paramsObj = {};
          break;
        case NavigationItems.FolllowUps:
          pageName = "TrackingPage";
          paramsObj = { stageId: TrackingStages.FollowUps };
          break;
        case NavigationItems.Leads:
          pageName = "TrackingPage";
          paramsObj = { stageId: TrackingStages.Leads };
          break;
        case NavigationItems.Closed:
          pageName = "TrackingPage";
          paramsObj = { stageId: TrackingStages.Closed };
          break;
        case NavigationItems.Settings:
          pageName = "UserSettingsPage";
          paramsObj = {};
          break;
        default:
          break;
      }
      this.$router.push({
        name: pageName,
        params: paramsObj
      });
    },
    async onLogout() {
      const response = await logoutUser();
      if (response?.isUserLogedout) {
        // Reset store (user info)
        useGeneralStore().$reset();
        useCalendarStore().$reset();
        // Redirect to login page
        this.$router.push({
          name: "LoginPage"
        });
      }
    },
    sessionExparationHandler() {
      if (!this.isSessionUserActive) {
        console.log("logged out auto!!!");
        this.onLogout();
      }
    },
    async closeDialog() {
      // const currentEpochTime = Number.parseInt(moment(new Date()).format("X"));
      this.isReminderDialogOpen = false;

      // const noteWithWatchedTime = {
      //   ...this.noteReminder,
      //   WatchedAt: currentEpochTime
      // };
      // const response = await updateNote(noteWithWatchedTime);
      // if (response.success) {
      //   console.log("updated watched at in note!", noteWithWatchedTime);
      // }
    }
  },
  computed: {
    ...mapState(useGeneralStore, [
      "userEmail",
      "userFullName",
      "isSessionUserActive",
      "noteReminder"
    ])
  },
  watch: {
    noteReminder: {
      handler(newVal) {
        if (newVal) {
          // If there is a new reminder for popup - open reminder with delay
          setTimeout(() => {
            this.isReminderDialogOpen = true;
          }, 5000);
        }
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
