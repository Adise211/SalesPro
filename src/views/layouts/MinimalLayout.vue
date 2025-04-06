<template>
  <v-layout class="minimal-layout rounded rounded-md bg-background">
    <v-main class="main-content">
      <slot></slot>
    </v-main>
  </v-layout>
</template>

<script>
export default {
  name: "MinimalLayout",
  components: {},
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
