<template>
  <div id="chart"></div>
</template>

<script>
const ApexCharts = window.ApexCharts;

export default {
  components: {},
  props: {
    chartType: {
      type: String,
      default: "line"
    },
    chartSeriesName: {
      type: String,
      default: "Sales"
    },
    chartSeriesData: {
      type: Array,
      default: () => [30, 40, 35, 50, 49, 60, 70, 91, 125]
    },
    chartXData: {
      type: Array,
      default: () => [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    },
    chartDataColors: {
      type: Array,
      default: () => ["#008ffb"]
    }
  },
  data: () => ({}),
  created() {},
  mounted() {
    var chart = new ApexCharts(document.querySelector("#chart"), this.chartOptions);

    chart.render();
  },
  methods: {},
  computed: {
    chartOptions() {
      return {
        chart: {
          type: this.chartType,
          height: "80%"
        },
        fill: {
          colors: this.chartDataColors
        },
        series: [
          {
            name: this.chartSeriesName,
            data: this.chartSeriesData
          }
        ],
        xaxis: {
          categories: this.chartXData
        }
      };
    }
  },
  watch: {}
};
</script>

<style scoped></style>
