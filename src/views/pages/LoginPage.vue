<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-spacer></v-spacer>
      <v-col md="3" class="my-auto">
        <!-- testt -->
        <div class="login-container pa-10">
          <div class="login-form">
            <!-- Email -->
            <v-text-field
              :model-value="userEmail"
              class="mx-auto"
              label="Email"
              append-inner-icon="mdi-email"
              variant="outlined"
              density="comfortable"
              style="width: 100%"
              color="primary"
            ></v-text-field>
            <!-- Password -->
            <v-text-field
              :model-value="userPassword"
              class="mx-auto"
              label="Password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              style="width: 100%"
              color="primary"
              @click:appendInner="showPassword = !showPassword"
            ></v-text-field>
          </div>
          <div class="login-actions d-flex flex-column align-center justify-center mt-5">
            <v-btn color="primary" variant="flat">Login</v-btn>
            <v-btn @click="onRegisterClick" variant="text" flat color="primary" class="mt-2"
              >New here? register now</v-btn
            >
          </div>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="6" class="login-background-image">
        <v-img :src="loginBackgroundURL"></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data: () => ({
    userEmail: "",
    userPassword: "",
    showPassword: false
  }),
  created() {},
  mounted() {},
  methods: {
    onRegisterClick() {
      console.log("register...");
    }
  },
  computed: {
    loginBackgroundURL() {
      return "images/login-image2.jpg";
    }
  },
  watch: {}
};
</script>

<style scoped>
.login-background-image {
  max-height: 100%;
}

/* .login-container {
  border: 2px black solid;
} */
</style>
