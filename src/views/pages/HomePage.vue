<template>
  <v-container fluid class="home-page fill-height d-block">
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
                <v-btn color="orange" icon="mdi-summit" size="x-small" variant="tonal"></v-btn>
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
      <!-- Follows (last month) -->
      <v-col>
        <AppCard>
          <template v-slot:card-text>
            <div class="text-center">
              <div class="card-header">
                <v-btn color="indigo" icon="mdi-briefcase" size="x-small" variant="tonal"></v-btn>
                <p class="text-medium-emphasis mt-1">Follow</p>
              </div>
              <div class="card-body">
                <p class="text-h4 my-5">{{ totalCountWithStatusFollow }}</p>
                <p class="text-indigo">Over last month 4.4%</p>
              </div>
            </div>
          </template>
        </AppCard>
      </v-col>
    </v-row>

    <v-row>
      <!-- Line chart -->
      <v-col cols="8">
        <AppCard>
          <template v-slot:card-text>
            <div class="text-h6 text-medium-emphasis mb-5">Monthly Recap Statistics</div>
            <canvas id="line-chart"></canvas>
          </template>
        </AppCard>
      </v-col>
      <!-- Pie chart -->
      <v-col cols="4">
        <AppCard>
          <template v-slot:card-text>
            <div class="text-h6 text-medium-emphasis mb-5">Sales By Products</div>
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
    pieChart: null,
    lineChart: null
  }),
  created() {},
  mounted() {
    this.initChartPie();
    this.initLineChart();
  },
  methods: {
    initChartPie() {
      const element = document.getElementById("pie-chart");

      this.pieChart = new Chart(element, {
        type: "pie",
        data: {
          labels: ["Red", "Blue", "Yellow"],
          datasets: [
            {
              label: "My First Dataset",
              data: [300, 50, 100],
              backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
              hoverOffset: 4
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
    },
    initLineChart() {
      const element = document.getElementById("line-chart");

      this.lineChart = new Chart(element, {
        type: "line",
        data: {
          labels: ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul"],
          datasets: [
            {
              label: "My First Dataset",
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1
            }
          ]
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
