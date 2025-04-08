<template>
  <AuthLayout>
    <AuthCardHeader />
    <v-card-text class="mx-4">
      <v-form>
        <v-text-field
          variant="outlined"
          label="Email"
          placeholder="Example@some.com"
          type="email"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          label="Password"
          placeholder="*******"
          type="password"
        ></v-text-field>
        <AuthCardFooter />
      </v-form>
    </v-card-text>
  </AuthLayout>
</template>

<script>
import AuthCardFooter from "./components/auth/AuthCardFooter.vue";
import AuthCardHeader from "./components/auth/AuthCardHeader.vue";
import { loginUser } from "@/firebase/services/user";
import AuthLayout from "./components/auth/AuthLayout.vue";

export default {
  name: "LoginPage",
  components: { AuthCardFooter, AuthCardHeader, AuthLayout },
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
</style>
