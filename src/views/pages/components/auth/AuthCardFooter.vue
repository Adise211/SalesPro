<template>
  <div class="v-col v-col-12 mt-5 text-center">
    <span class="font-weight-meduim text-high-emphasis"
      >{{ login ? "New on our platform?" : "Already have an account?" }}
    </span>
    <a class="text-primary" :href="login ? '/signup' : '/login'">{{
      login ? " Create an account" : " Sign in instead"
    }}</a>
  </div>
  <div class="v-col v-col-12 d-flex align-center">
    <hr class="v-divider v-theme--light" aria-orientation="horizontal" role="separator" />
    <span class="mx-4 text-medium-emphasis">or</span>
    <hr class="v-divider v-theme--light" aria-orientation="horizontal" role="separator" />
  </div>
  <div class="v-col v-col-12 text-center">
    <v-icon color="blue" class="mx-1">mdi-facebook</v-icon>
    <v-icon color="red" class="mx-1">mdi-gmail</v-icon>
    <v-icon color="purple" class="mx-1">mdi-yahoo</v-icon>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    login: {
      type: Boolean,
      default: false
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
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
