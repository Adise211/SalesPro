<template>
  <TrackingBoard :currentStage="currentStageName" :statusId="currentStatus"></TrackingBoard>
</template>

<script>
import TrackingBoard from "@/components/TrackingBoard.vue";
import { TrackingStagesId } from "@/utilities/consts";
const DEFAULT_COMPONENT = 0;

export default {
  name: "TrackingPage",
  components: { TrackingBoard },
  props: {
    stageId: {
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
  computed: {
    currentStatus() {
      let result;
      if (this.currentStageName === TrackingStagesId.FollowUps) {
        result = 0;
      } else if (this.currentStageName === TrackingStagesId.Leads) {
        result = 1;
      } else if (this.currentStageName === TrackingStagesId.Closed) {
        result = 2;
      } else {
        result = DEFAULT_COMPONENT;
      }
      return result;
    }
  },
  watch: {
    stageId: {
      handler(newVal) {
        this.currentStageName = newVal;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
