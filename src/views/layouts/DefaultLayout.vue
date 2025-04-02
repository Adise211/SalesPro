<template>
  <v-app :theme="isDarkMode ? 'dark' : 'light'" class="default-layout">
    <v-layout class="rounded rounded-md">
      <VerticalNavLayout></VerticalNavLayout>
      <v-app-bar color="background" flat>
        <div class="search-trigger w-25 d-flex justify-start align-center ml-3">
          <v-icon>mdi-magnify</v-icon>
          <span class="mx-2 text-medium-emphasis">Search</span>
          <span class="meta-key text-medium-emphasis">&#8984;K</span>
        </div>
        <template v-slot:append>
          <!-- 👉 Theme Toggle  -->
          <v-icon @click="isDarkMode = !isDarkMode">
            {{ isDarkMode ? "mdi-weather-sunny" : "mdi-weather-night" }}
          </v-icon>
          <!-- 👉 Notification -->
          <AppNotifications />
          <!-- 👉 User Info + Signout -->
          <UserMenu @onItemClick="userMenuClickHandler" />
        </template>
      </v-app-bar>

      <v-main class="main-content">
        <slot></slot>
      </v-main>
      <!-- 👉 Footer -->
      <AppFooter></AppFooter>
    </v-layout>
  </v-app>
</template>

<script>
import { mapState } from "pinia";
import { useSessionStore } from "../../stores/session";
import { useGeneralStore } from "@/stores/general";
import { signoutUser } from "@/firebase/services/user";
import { Config } from "@/utilities/config";
import { convertTime } from "@/utilities/utilsFuncs";
import AppFooter from "./components/AppFooter.vue";
import VerticalNavLayout from "./components/VerticalNavLayout.vue";
import UserMenu from "./components/UserMenu.vue";
import AppNotifications from "./components/AppNotifications.vue";

let checkUserActivityInterval;
const USER_MENU_ACTION_TYPES = {
  Profile: "profile",
  Settings: "settings",
  Help: "help",
  Logout: "logout"
};

export default {
  name: "DefaultLayout",
  components: { VerticalNavLayout, UserMenu, AppNotifications, AppFooter },
  props: {},
  data: () => ({
    isDarkMode: false
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
    userMenuClickHandler(action) {
      switch (action) {
        case USER_MENU_ACTION_TYPES.Profile:
          //
          break;
        case USER_MENU_ACTION_TYPES.Settings:
          //
          break;
        case USER_MENU_ACTION_TYPES.Help:
          //
          break;
        case USER_MENU_ACTION_TYPES.Logout:
          this.logout();
          break;
        default:
          break;
      }
    },
    async logout() {
      const response = await signoutUser();

      if (response.Result.ResultCode > 0) {
        // Reset store (user info)
        useGeneralStore().$reset();
        useSessionStore().$reset();

        // Redirect to login page
        this.$router.push({
          name: "LoginPage"
        });
      }
    },
    sessionExparationHandler() {
      if (!this.isSessionUserActive) {
        console.log("logged out auto!!!");
        this.logout();
      }
    }
  },
  computed: {
    ...mapState(useSessionStore, [
      "userEmail",
      "userFullName",
      "isSessionUserActive",
      "userWorkSpace",
      "userRole",
      "userPhotoUrl"
    ])
  },
  watch: {}
};
</script>

<style scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}
</style>
