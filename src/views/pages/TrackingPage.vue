<template>
  <div class="tracking-page fill-height">
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import FollowUps from "../../components/FollowUps.vue";
import { TrackingPageLabels } from "../../utilities/consts";
const DEFAULT_COMPONENT = "FollowUps";

export default {
  name: "TrackingPage",
  components: { FollowUps },
  props: {
    stageId: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    currentLevel: ""
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    currentComponent() {
      let result;
      if (this.currentLevel === TrackingPageLabels.FollowUps) {
        result = "FollowUps";
      } else {
        result = DEFAULT_COMPONENT;
      }
      return result;
    }
  },
  watch: {
    stageId: {
      handler(newVal) {
        this.currentLevel = newVal;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
