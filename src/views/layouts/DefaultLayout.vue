<template>
  <div class="default-layout">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer color="primary" persistent width="200">
        <v-list>
          <v-list-item class="py-5" :title="userWorkSpace.Name" :subtitle="userRole"></v-list-item>
          <v-divider></v-divider>
          <v-list-item
            v-for="(item, index) in navItems"
            :key="index"
            :value="item.value"
            link
            :title="item.title"
            :append-icon="item.icon"
            @click="onNavItemClick(item.value)"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar color="secondary" flat>
        <v-app-bar-title class="text-h5 font-weight-bold">SalesPro</v-app-bar-title>
        <template v-slot:append>
          <!-- Edit User Info  -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-cog"> </v-btn>
            </template>
            <v-list class="text-center">
              <v-list-item>
                <v-list-item-title>Edit Profile</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-title>Change Password</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- Notification -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon="mdi-bell"> </v-btn>
            </template>
            <v-list width="250">
              <v-list-item v-for="item in notificationsList" :key="item.id">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-high-emphasis">
                  {{ item.subtitle }}
                </v-list-item-subtitle>
                <v-spacer></v-spacer>
                <template v-slot:append>
                  <v-list-item-action class="flex-column align-end">
                    <small class="mb-4 text-high-emphasis opacity-60">{{ item.date }}</small>
                    <v-spacer></v-spacer>
                    <small class="mb-4 text-high-emphasis opacity-60">{{ item.time }}</small>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- User Info + Signout -->
          <v-avatar class="mx-3 app-cursor-pointer">
            <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
            <v-menu activator="parent" location="bottom">
              <v-card width="250">
                <v-card-text class="text-center">
                  <v-list class="pb-0">
                    <v-list-item>
                      <p class="text-h6 text-truncate">{{ userNameDisplay }}</p>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                      <p class="text-truncate">{{ userEmail }}</p>
                    </v-list-item>
                    <v-list-item>
                      <v-btn block color="primary" @click="onSignout"> Signout </v-btn>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-avatar>
        </template>
      </v-app-bar>

      <v-main class="main-content">
        <slot></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import { NavigationItems } from "@/utilities/consts";
import { mapState } from "pinia";
import { useSessionStore } from "../../stores/session";
import { useGeneralStore } from "@/stores/general";
import { signoutUser } from "@/firebase/services/user";
import { Config } from "@/utilities/config";
import { convertTime } from "@/utilities/utilsFuncs";

let checkUserActivityInterval;

export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({}),
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
        case NavigationItems.Home:
          pageName = "HomePage";
          paramsObj = {};
          break;
        case NavigationItems.Calendar:
          pageName = "CalendarPage";
          paramsObj = {};
          break;
        case NavigationItems.Sales:
          pageName = "SalesPage";
          paramsObj = {};
          break;
        case NavigationItems.Products:
          pageName = "ProductsPage";
          paramsObj = {};
          break;
        case NavigationItems.Customers:
          pageName = "CustomersPage";
          paramsObj = {};
          break;
        case NavigationItems.Teams:
          pageName = "TeamsPage";
          paramsObj = {};
          break;
        case NavigationItems.Files:
          pageName = "FilesPage";
          paramsObj = {};
          break;
        case NavigationItems.MyAccount:
          pageName = "MyAccountPage";
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
    async onSignout() {
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
        this.onSignout();
      }
    }
  },
  computed: {
    ...mapState(useSessionStore, [
      "userEmail",
      "userFullName",
      "isSessionUserActive",
      "userWorkSpace",
      "userRole"
    ]),
    navItems() {
      return [
        {
          title: NavigationItems.Home,
          value: NavigationItems.Home,
          icon: "mdi-home",
          isShownNow: false
        },
        {
          title: NavigationItems.Calendar,
          value: NavigationItems.Calendar,
          icon: "mdi-calendar",
          isShownNow: false
        },
        {
          title: NavigationItems.Sales,
          value: NavigationItems.Sales,
          icon: "mdi-sale",
          isShownNow: false
        },
        {
          title: NavigationItems.Products,
          value: NavigationItems.Products,
          icon: "mdi-package-variant",
          isShownNow: false
        },
        {
          title: NavigationItems.Customers,
          value: NavigationItems.Customers,
          icon: "mdi-domain",
          isShownNow: false
        },
        {
          title: NavigationItems.Teams,
          value: NavigationItems.Teams,
          icon: "mdi-account-multiple",
          isShownNow: false
        },
        {
          title: NavigationItems.Files,
          value: NavigationItems.Files,
          icon: "mdi-file-document",
          isShownNow: false
        },
        {
          title: "My Account",
          value: NavigationItems.MyAccount,
          icon: "mdi-account",
          isShownNow: false
        }
      ];
    },
    userNameDisplay() {
      const LAST_NAME = this.userFullName.split(" ")[1];
      const LAST_NAME_INDEX = this.userFullName.indexOf(LAST_NAME);

      return this.userFullName.slice(0, LAST_NAME_INDEX + 1) + ".";
    },
    notificationsList() {
      return [
        { id: 1, title: "test 1", subtitle: "Some text for test", date: "21/01/24", time: "12:45" },
        { id: 2, title: "test 1", subtitle: "Some text for test", date: "19/05/24", time: "13:00" },
        { id: 3, title: "test 1", subtitle: "Some text for test", date: "31/12/24", time: "19:20" }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
