<template>
  <ViewCards>
    <template v-slot:card-title>Events: </template>
    <template v-slot:card-sub-title>date </template>
    <template v-slot:card-text>description </template>
  </ViewCards>
</template>

<script>
import ViewCards from "./ViewCards.vue";
export default {
  components: { ViewCards },
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
