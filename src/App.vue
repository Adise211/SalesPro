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
  mounted() {},
  updated() {},
  methods: {},
  computed: {
    currentLayout() {
      return this.$route.meta?.layout || DEFAULT_LAYOUT;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
