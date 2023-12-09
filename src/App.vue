<template>
  <DefaultLayout>
    <RouterView></RouterView>
  </DefaultLayout>
</template>

<script>
import { RouterView } from "vue-router";
// @ts-ignore
import DefaultLayout from "./views/layouts/DefaultLayout.vue";
export default {
  name: "App",
  components: { DefaultLayout, RouterView },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
