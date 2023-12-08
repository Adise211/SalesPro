<template>
  <div class="defaultLayout">
    <!-- 1) top bar + navigation -->
    <v-layout>
      <v-app-bar color="white">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="isMenuOpen = !isMenuOpen"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>SalesPro</v-app-bar-title>
        <!-- <v-spacer></v-spacer>
        <v-btn variant="text" icon="mdi-magnify"></v-btn> -->
      </v-app-bar>

      <v-navigation-drawer v-model="isMenuOpen">
        <v-list-item title="My Application" subtitle="Vuetify" class="mt-2"></v-list-item>
        <v-divider></v-divider>
        <v-list-item link title="List Item 1"></v-list-item>
        <v-list-item link title="List Item 2"></v-list-item>
        <v-list-item link title="List Item 3"></v-list-item>

        <template v-slot:append>
          <div class="pa-2">
            <v-btn block> Logout </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
    </v-layout>
    <!-- 2) main (slot) -->
    <!-- 3) footer -->
  </div>
</template>

<script>
export default {
  name: "DefaultLayout",
  components: {},
  props: {},
  data: () => ({
    isMenuOpen: false
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
