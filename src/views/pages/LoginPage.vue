<template>
  <v-container fluid class="fill-height pb-0">
    <v-row class="fill-height">
      <v-spacer></v-spacer>
      <v-col md="3 my-auto">
        <div class="login-container">
          <!-- Logo -->
          <!-- <v-img :src="logoURL" class="mb-10" /> -->
          <div class="text-h3 text-primary text-center font-italic mb-5 font-weight-medium">
            SalesPro
          </div>
          <div class="login-form-wrapper">
            <!-- Email -->
            <v-form ref="loginForm">
              <v-text-field
                v-model="userEmail"
                class="mx-auto"
                placeholder="Email"
                append-inner-icon="mdi-email"
                :rules="[loginRules.required]"
                validate-on="blur"
                variant="outlined"
                density="comfortable"
                style="width: 80%"
                color="primary"
              ></v-text-field>
              <!-- Password -->
              <v-text-field
                v-model="userPassword"
                class="mx-auto mt-1"
                placeholder="Password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="[loginRules.required]"
                validate-on="blur"
                variant="outlined"
                density="comfortable"
                style="width: 80%"
                color="primary"
                @click:appendInner="showPassword = !showPassword"
              ></v-text-field>
            </v-form>
          </div>
          <div class="login-actions d-flex flex-column align-center justify-center mt-5">
            <v-btn color="primary" variant="flat" @click="onSigninClick" :loading="isLoading"
              >Login</v-btn
            >
            <a
              class="text-decoration-none mt-3"
              rel="noopener noreferrer"
              target="_self"
              @click="signupAnchorHandler"
            >
              New here? <span class="text-primary">Sign Up</span>
            </a>
          </div>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="7" class="login-background-image pa-0">
        <!-- BG Image -->
        <v-img :src="loginBackgroundURL" width="300%" height="300%" cover></v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { loginUser } from "@/firebase/services/user";
export default {
  name: "LoginPage",
  components: {},
  props: {},
  data: () => ({
    userEmail: "",
    userPassword: "",
    showPassword: false,
    isLoading: false
  }),
  created() {},
  mounted() {},
  methods: {
    async onSigninClick() {
      const { valid } = await this.$refs.loginForm.validate();
      if (valid) {
        this.isLoading = true;
        const response = await loginUser({
          Email: this.userEmail,
          Password: this.userPassword
        });
        console.log("client: signin response -", response);

        if (response) {
          this.isLoading = false;
          this.$router.push({
            name: "HomePage"
          });
        }
      }
    },
    signupAnchorHandler() {
      this.$router.push({
        name: "SignupPage"
      });
    }
  },
  computed: {
    loginBackgroundURL() {
      return "images/logo-image3.jpg";
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
