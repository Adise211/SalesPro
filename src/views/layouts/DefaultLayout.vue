<template>
  <div class="default-layout">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer color="blue-grey-darken-4" v-model="isMenuOpen">
        <v-list>
          <v-list-item
            class="py-5"
            title="Sara Smith"
            subtitle="Developer"
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-group value="Mettings" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Mettings"></v-list-item>
            </template>
            <v-list-item link title="Calendar" variant="tonal" append-icon="mdi-calendar">
            </v-list-item>
            <v-list-item
              link
              title="Create Event"
              variant="tonal"
              append-icon="mdi-calendar-edit"
            ></v-list-item>
          </v-list-group>
          <v-list-item link title="Notes"></v-list-item>
          <v-list-group value="Tracking" fluid>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Tracking"></v-list-item>
            </template>
            <v-list-item
              link
              title="Follow ups"
              variant="tonal"
              append-icon="mdi-run"
            ></v-list-item>
            <v-list-item
              link
              title="Leads"
              variant="tonal"
              append-icon="mdi-briefcase"
            ></v-list-item>
            <v-list-item
              link
              title="Closed"
              variant="tonal"
              append-icon="mdi-handshake"
            ></v-list-item>
          </v-list-group>
          <v-list-item link title="Extract From Files"></v-list-item>
          <v-list-item link title="Settings"></v-list-item>
        </v-list>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block color="primary"> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-app-bar :order="order" color="blue-grey-lighten-4" flat title="SalesPro">
        <!-- <template v-slot:append>
          <v-btn @click="onMenuOpen">Close menu</v-btn>
        </template> -->
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="onMenuOpen"></v-app-bar-nav-icon>
        </template>
      </v-app-bar>

      <v-main class="d-flex align-center justify-center" style="min-height: 300px">
        Main Content
        <slot></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({
    isMenuOpen: false,
    order: 0
  }),
  created() {},
  mounted() {},
  methods: {
    onMenuOpen() {
      if (this.order === 0) {
        this.order = -1;
        this.isMenuOpen = false;
      } else {
        this.order = 0;
        this.isMenuOpen = true;
      }
    }
  },
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
