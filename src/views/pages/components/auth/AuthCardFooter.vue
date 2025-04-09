<template>
  <div class="d-flex align-center mb-3">
    <v-checkbox-btn label="Remember me" hide-details></v-checkbox-btn>
    <a class="text-primary" v-if="login">Forgot Password?</a>
  </div>
  <v-btn color="primary" block>{{ login ? "Login" : "Signup" }}</v-btn>
  <div class="mt-5 text-center">
    <span class="font-weight-meduim text-high-emphasis"
      >{{ login ? "New on our platform?" : "Already have an account?" }}
    </span>
    <a class="text-primary">{{ login ? "Create an account" : "Sign in instead" }}</a>
  </div>
  <div class="v-col v-col-12 d-flex align-center">
    <hr class="v-divider v-theme--light" aria-orientation="horizontal" role="separator" />
    <span class="mx-4">or</span>
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
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
