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
      <!-- Leads  (last month) -->
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

    <v-row>
      <v-col cols="8">
        <AppCard>
          <template v-slot:card-text>
            <div>ttt</div>
          </template>
        </AppCard>
      </v-col>
      <v-col cols="4">
        <AppCard>
          <template v-slot:card-text>
            <canvas id="pie-chart"></canvas>
          </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";

const Chart = window.Chart;

export default {
  name: "HomePage",
  components: { AppCard },
  props: {},
  data: () => ({
    activeChart: null
  }),
  created() {},
  mounted() {
    this.initChartPie();
  },
  methods: {
    initChartPie() {
      const element = document.getElementById("pie-chart");

      this.activeChart = new Chart(element, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
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
