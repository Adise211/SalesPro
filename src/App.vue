<template>
  <component :is="currentLayout">
    <RouterView></RouterView>
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
  data: () => ({}),
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
      if (this.$vuetify.display.mdAndDown) {
        this.$router.push({
          name: "ErrorMessagesPage",
          params: {
            messageId: 1
          }
        });
      }
    }
  },
  computed: {
    currentLayout() {
      return this.$route.meta?.layout || DEFAULT_LAYOUT;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
