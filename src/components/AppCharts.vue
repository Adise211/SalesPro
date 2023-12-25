<template>
  <div>App Charts</div>
  <div id="chart"></div>
</template>

<script>
const ApexCharts = window.ApexCharts;

export default {
  components: {},
  props: {},
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
          type: "line"
        },
        series: [
          {
            name: "sales",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
          }
        ],
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      };
    }
  },
  watch: {}
};
</script>

<style scoped></style>
