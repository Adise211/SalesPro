<template>
  <v-container fluid class="calendar-page">
    <v-row>
      <v-col md="4">
        <ViewCards>
          <template v-slot:card-text>
            <Calendar />
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import { Calendar } from "v-calendar";
import "v-calendar/style.css";

export default {
  name: "CalendarPage",
  components: { ViewCards, Calendar },
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
