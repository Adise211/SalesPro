<template>
  <TrackingBoard :currentStageName="currentStageName"></TrackingBoard>
</template>

<script>
import TrackingBoard from "@/components/TrackingBoard.vue";

export default {
  name: "TrackingPage",
  components: { TrackingBoard },
  props: {
    stageName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    currentStageName: ""
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {
    stageName: {
      handler(newVal) {
        this.currentStageName = newVal;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
