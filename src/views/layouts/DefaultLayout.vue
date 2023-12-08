<template>
  <div class="default-layout">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer color="grey-darken-2" v-model="isMenuOpen"></v-navigation-drawer>
      <v-app-bar :order="order" color="grey-lighten-2" flat title="SalesPro">
        <!-- <template v-slot:append>
          <v-btn @click="onMenuOpen">Close menu</v-btn>
        </template> -->
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="onMenuOpen"></v-app-bar-nav-icon>
        </template>
      </v-app-bar>

      <v-main class="d-flex align-center justify-center" style="min-height: 300px">
        Main Content
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
