<template>
  <v-container fluid class="fill-height pb-0">
    <v-row class="fill-height d-flex align-center justify-center">
      <v-col cols="12" md="3">
        <div class="login-container">
          <!-- Logo -->
          <!-- <v-img :src="logoURL" class="mb-10" /> -->
          <div class="text-h3 text-primary text-center font-italic mb-12 font-weight-medium">
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
                :rules="[loginRules.required, loginRules.emailMatch]"
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
                :rules="[loginRules.required, loginRules.passwordLength]"
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
            <v-btn color="primary" variant="flat" @click="onLoginClick" :loading="isLoading"
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
            <div>
              <v-alert
                v-if="isLoginError"
                type="error"
                variant="outlined"
                text="Email or password are incorrect"
                class="mt-5"
              >
              </v-alert>
            </div>
          </div>
        </div>
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
    isLoading: false,
    isLoginError: false
  }),
  created() {},
  mounted() {},
  methods: {
    async onLoginClick() {
      const { valid } = await this.$refs.loginForm.validate();
      if (valid) {
        this.isLoading = true;
        const response = await loginUser({
          Email: this.userEmail,
          Password: this.userPassword
        });
        console.log("client: signin response -", response);

        if (!response) {
          this.isLoading = false;
          this.isLoginError = true;
        } else if (response.Result.ResultCode > 0) {
          this.isLoginError = false;
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
      const emailRegex = new RegExp(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/);
      return {
        required: (value) => !!value || "Required.",
        emailMatch: (value) => emailRegex.test(value) || "Invalid e-mail.",
        passwordLength: (value) => value.length >= 6 || "Insert at at least 6 characters"
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
