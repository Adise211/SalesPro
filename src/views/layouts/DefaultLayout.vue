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
            <v-btn block color="primary" @click="onLogoutClick"> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar color="blue-grey-darken-4" flat title="SalesPro"> </v-app-bar>

      <v-main class="main-content">
        <slot></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import { NavigationItems, CalendarPageMode, TrackingPageLabels } from "../../utilities/consts";
import { mapState } from "pinia";
import { useGeneralStore } from "../../stores/general";
import { useCalendarStore } from "../../stores/calendar";
import { logoutUser } from "../../firebase/services/user";

export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
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
          break;
        case NavigationItems.FolllowUps:
          pageName = "TrackingPage";
          paramsObj = { trackingLabel: TrackingPageLabels.FollowUps };
          break;
        case NavigationItems.Leads:
          break;
        case NavigationItems.Closed:
          break;
        case NavigationItems.Settings:
          break;
        default:
          break;
      }
      this.$router.push({
        name: pageName,
        params: paramsObj
      });
    },
    async onLogoutClick() {
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
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["userEmail", "userFullName"])
  },
  watch: {}
};
</script>

<style scoped></style>
