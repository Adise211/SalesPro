<template>
  <div class="default-layout">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer color="blue-grey-darken-4" persistent>
        <v-list>
          <v-list-item
            class="py-5"
            title="Sara Smith"
            subtitle="Developer"
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-group value="Meetings" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Mettings"></v-list-item>
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
            <v-btn block color="primary" @click="onNavItemClick('Logout')"> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar :order="drawerOrder" color="blue-grey-darken-4" flat title="SalesPro">
        <!-- <template v-slot:append>
          <v-btn @click="onMenuOpen">Close menu</v-btn>
        </template> -->
        <!-- <template v-slot:prepend>
          <v-app-bar-nav-icon @click="onMenuOpen"></v-app-bar-nav-icon>
        </template> -->
      </v-app-bar>

      <v-main class="main-content">
        <slot></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import { NavigationItems } from "../../utilities/consts";
export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({
    // isMenuOpen: false,
    // drawerOrder: 0
  }),
  created() {},
  mounted() {},
  methods: {
    // onMenuOpen() {
    //   if (this.order === 0) {
    //     this.order = -1;
    //     this.isMenuOpen = false;
    //   } else {
    //     this.order = 0;
    //     this.isMenuOpen = true;
    //   }
    // },
    onNavItemClick(itemName) {
      let pageName;
      switch (itemName) {
        case NavigationItems.Calendar:
          pageName = "CalendarPage";
          break;
        case NavigationItems.CreateEvent:
          break;
        case NavigationItems.Notes:
          break;
        case NavigationItems.FolllowUps:
          break;
        case NavigationItems.Leads:
          break;
        case NavigationItems.Closed:
          break;
        case NavigationItems.Settings:
          break;
        case NavigationItems.Logout:
          break;
        default:
          break;
      }

      this.$router.push({
        name: pageName
      });
    }
  },
  computed: {},
  watch: {}
};
</script>

<style scoped>
.main-content {
  height: calc(100vh - 20px);
}
</style>
