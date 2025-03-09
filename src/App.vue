<template>
  <component :is="currentLayout" :displayNote="displayNote">
    <RouterView></RouterView>
  </component>
</template>

<script>
import { RouterView } from "vue-router";
import DefaultLayout from "./views/layouts/DefaultLayout.vue";
import MinimalLayout from "./views/layouts/MinimalLayout.vue";
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "./stores/general";
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
    ...mapActions(useGeneralStore, ["resetToastMessage"]),
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
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["toastMessage"]),
    currentLayout() {
      return this.$route.meta?.layout || DEFAULT_LAYOUT;
    },
    isSmallDisplay() {
      return this.$vuetify.display.width <= 1200;
    }
  },
  watch: {
    toastMessage: {
      handler(newMessage) {
        if (newMessage.type && newMessage.message) {
          // open toast + clear the toast message once it disappears
          this.$toast.open({ ...newMessage, onDismiss: this.resetToastMessage() });
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style scoped></style>
