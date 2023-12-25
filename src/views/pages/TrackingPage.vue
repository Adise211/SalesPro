<template>
  <div class="tracking-page">
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import FollowUps from "../../components/FollowUps.vue";
import { TrackingPageLevels } from "../../utilities/consts";
const DEFAULT_COMPONENT = "FollowUps";

export default {
  name: "TrackingPage",
  components: { FollowUps },
  props: {
    trackingLevel: {
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
      if (this.currentLevel === TrackingPageLevels.Follow) {
        result = "FollowUps";
      } else {
        result = DEFAULT_COMPONENT;
      }
      return result;
    }
  },
  watch: {
    trackingLevel: {
      handler(newVal) {
        this.currentLevel = newVal;
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>
