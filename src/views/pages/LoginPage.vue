<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-spacer></v-spacer>
      <v-col md="3" class="mt-16">
        <div class="login-container px-10">
          <!-- Logo -->
          <v-img :src="logoURL" class="mb-10" />
          <div class="login-form-wrapper">
            <!-- Email -->
            <v-form ref="loginForm">
              <v-text-field
                :model-value="userEmail"
                class="mx-auto"
                placeholder="Email"
                append-inner-icon="mdi-email"
                :rules="[loginRules.required, loginRules.emailMatch]"
                validate-on="blur"
                variant="outlined"
                density="comfortable"
                style="width: 100%"
                color="primary"
              ></v-text-field>
              <!-- Password -->
              <v-text-field
                :model-value="userPassword"
                class="mx-auto mt-1"
                placeholder="Password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="[loginRules.required]"
                validate-on="blur"
                variant="outlined"
                density="comfortable"
                style="width: 100%"
                color="primary"
                @click:appendInner="showPassword = !showPassword"
              ></v-text-field>
            </v-form>
          </div>
          <div class="login-actions d-flex flex-column align-center justify-center mt-5">
            <v-btn color="primary" variant="flat">Login</v-btn>
            <a
              class="text-primary text-decoration-none mt-5 ml-4"
              rel="noopener noreferrer"
              target="_self"
              @click="signupAnchorHandler"
            >
              Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
            </a>
          </div>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="6" class="login-background-image">
        <!-- BG Image -->
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
    signupAnchorHandler() {
      this.$router.push({
        name: "SignupPage"
      });
    }
  },
  computed: {
    loginBackgroundURL() {
      return "images/login-image2.jpg";
    },
    logoURL() {
      return "images/logo.png";
    },
    loginRules() {
      const emailRegex = new RegExp(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, "g");
      return {
        required: (value) => !!value || "Required.",
        emailMatch: (value) => emailRegex.test(value) || "Invalid e-mail."
      };
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
