<template>
  <v-container fluid class="calendar-page">
    <v-row>
      <!-- Closed Deals (last month) -->
      <v-col>
        <AppCard>
          <template v-slot:card-text>
            <div class="text-center">
              <div class="card-header">
                <v-btn color="blue" icon="mdi-handshake" size="x-small" variant="tonal"></v-btn>
                <p class="text-medium-emphasis mt-1">Closed</p>
              </div>
              <div class="card-body">
                <p class="text-h4 my-5">{{ totalCountWithStatusClosed }}</p>
                <p class="text-blue">Over last month 2.5%</p>
              </div>
            </div>
          </template>
        </AppCard>
      </v-col>
      <!-- Total Sold Products (last month)-->
      <v-col>
        <AppCard>
          <template v-slot:card-text>
            <div class="text-center">
              <div class="card-header">
                <v-btn
                  color="green"
                  icon="mdi-package-variant"
                  size="x-small"
                  variant="tonal"
                ></v-btn>
                <p class="text-medium-emphasis mt-1">Products</p>
              </div>
              <div class="card-body">
                <p class="text-h4 my-5">48</p>
                <p class="text-green">Over last month 4.4%</p>
              </div>
            </div>
          </template>
        </AppCard>
      </v-col>
      <!-- Leads? -->
      <v-col>
        <AppCard>
          <template v-slot:card-text>
            <div class="text-center">
              <div class="card-header">
                <v-btn color="orange" icon="mdi-briefcase" size="x-small" variant="tonal"></v-btn>
                <p class="text-medium-emphasis mt-1">Leads</p>
              </div>
              <div class="card-body">
                <p class="text-h4 my-5">{{ totalCountWithStatusLeads }}</p>
                <p class="text-orange">Over last month 4.4%</p>
              </div>
            </div>
          </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import { mapState } from "pinia";
import { useGeneralStore } from "../../stores/general";

export default {
  name: "HomePage",
  components: { AppCard },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    ...mapState(useGeneralStore, [
      "totalCountWithStatusFollow",
      "totalCountWithStatusLeads",
      "totalCountWithStatusClosed"
    ])
  },
  watch: {}
};
</script>

<style scoped></style>
