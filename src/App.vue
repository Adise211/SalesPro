<template>
  <component :is="currentLayout" :displayNote="displayNote">
    <RouterView @onWatchNote="onWatchNote"></RouterView>
  </component>
</template>

<script>
import { RouterView } from "vue-router";
// @ts-ignore
import DefaultLayout from "./views/layouts/DefaultLayout.vue";
import MinimalLayout from "./views/layouts/MinimalLayout.vue";
const DEFAULT_LAYOUT = "MinimalLayout";

export default {
  name: "App",
  components: { DefaultLayout, RouterView, MinimalLayout },
  props: {},
  data: () => ({
    displayNote: null
  }),
  created() {},
  mounted() {
    window.addEventListener("resize", this.screenResizeHandler);
  },
  unmounted() {
    window.removeEventListener("resize", this.screenResizeHandler);
  },
  updated() {},
  methods: {
    screenResizeHandler() {
      // if it's small display - send user to error message page
      if (this.isSmallDisplay) {
        this.$router.push({
          name: "ErrorMessagesPage",
          params: {
            messageId: 1
          }
        });
      } else {
        // if it's desktop - send back to main page
        this.$router.push({
          name: "CalendarPage",
          params: { calendarMode: "view" }
        });
      }
    },
    onWatchNote(note) {
      this.displayNote = note;
    }
  },
  computed: {
    currentLayout() {
      return this.$route.meta?.layout || DEFAULT_LAYOUT;
    },
    isSmallDisplay() {
      return this.$vuetify.display.width <= 1200;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
