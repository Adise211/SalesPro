<template>
  <v-card-item class="v-col v-col-12">
    <div class="logo d-flex mt-10 justify-center align-end">
      <v-icon color="primary" size="36">mdi-flash-outline</v-icon>
      <div class="text-h5 font-weight-medium text-high-emphasis text-uppercase">LightSale</div>
    </div>
  </v-card-item>
  <v-card-text class="v-col v-col-12 pt-4 mx-8">
    <h4 class="text-h5 mb-1 text-high-emphasis">{{ headerTitle }}</h4>
    <p class="mb-0 font-weight-meduim text-high-emphasis">
      {{ headerSubTitle }}
    </p>
  </v-card-text>
</template>

<script>
export default {
  components: {},
  props: {
    login: {
      type: Boolean,
      default: true
    },
    signup: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    headerTitle() {
      return this.login ? "Welcome to LightSale! 👋🏻" : "Adventure starts here 🚀";
    },
    headerSubTitle() {
      return this.login
        ? "Please sign-in to your account and start the adventure"
        : "Make your sale management easy and fun!";
    }
  },
  watch: {}
};
</script>

<style scoped></style>
