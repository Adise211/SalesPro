<template>
  <v-container fluid>
    <v-row>
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <!-- <AppCharts></AppCharts> -->
          </template>
        </ViewCards>
      </v-col>
      <v-col md="6">
        <ViewCards> </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";

export default {
  name: "FollowUps",
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
