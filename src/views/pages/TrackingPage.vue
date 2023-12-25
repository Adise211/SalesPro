<template>
  <div>
    <ViewCards>
      <template v-slot:card-text>
        <AppCharts></AppCharts>
      </template>
    </ViewCards>
  </div>
</template>

<script>
import ViewCards from "../../components/ViewCards.vue";
import AppCharts from "../../components/AppCharts.vue";
export default {
  name: "TrackingPage",
  components: { ViewCards, AppCharts },
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
