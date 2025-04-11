<template>
  <AuthLayout>
    <AuthCardHeader signup />
    <v-card-text class="mx-4">
      <v-form ref="signupForm">
        <v-text-field
          v-model="userName"
          variant="outlined"
          label="Username"
          placeholder="John Doe"
          type="text"
          :rules="[signupRules.required, signupRules.nameMatch]"
        ></v-text-field>
        <v-text-field
          v-model="userEmail"
          variant="outlined"
          label="Email"
          placeholder="Example@some.com"
          type="email"
          :rules="[signupRules.required, signupRules.emailMatch]"
        ></v-text-field>
        <v-text-field
          v-model="userPassword"
          variant="outlined"
          label="Password"
          placeholder="*******"
          type="password"
          :rules="[signupRules.required, signupRules.passwordLength]"
        ></v-text-field>
        <div class="d-flex align-center mb-3">
          <v-checkbox-btn label="Remember me" hide-details></v-checkbox-btn>
          <a class="text-primary">Forgot Password?</a>
        </div>
        <v-btn color="primary" block @click="signupHandler" :loading="isLoading">Signup</v-btn>
        <AuthCardFooter signup />
      </v-form>
    </v-card-text>
  </AuthLayout>
</template>

<script>
import AuthLayout from "../pages/components/auth/AuthLayout.vue";
import AuthCardHeader from "./components/auth/AuthCardHeader.vue";
import AuthCardFooter from "./components/auth/AuthCardFooter.vue";
import { checkIfUserExistWByEmail, createNewUser } from "@/firebase/services/user";

export default {
  name: "SignupPage",
  components: { AuthLayout, AuthCardHeader, AuthCardFooter },
  props: {},
  data: () => ({
    userName: "",
    userEmail: "",
    userPassword: "",
    showPassword: false,
    // userFirstName: "",
    // userLastName: "",
    // userWorkspace: "",
    // userRole: "",
    isLoading: false,
    errorMessage: ""
  }),
  created() {},
  mounted() {},
  methods: {
    async isUserAlreadyExist() {
      const response = await checkIfUserExistWByEmail({
        Email: this.userEmail
      });

      return response.Result.ResultCode > 0 ? false : true;
    },
    async signupHandler() {
      const { valid } = await this.$refs.signupForm.validate();
      const isUserExist = await this.isUserAlreadyExist();
      // If form is valid + is new user
      if (valid && !isUserExist) {
        this.isLoading = true;
        const newUserData = {
          UserName: this.userName,
          Email: this.userEmail,
          Password: this.userPassword
        };
        const response = await createNewUser(newUserData);
        console.log("create new user response:", response);
        if (response.Result.ResultCode > 0) {
          this.isLoading = false;
        }
      }
    },

    signinAnchorHandler() {
      this.$router.push({
        name: "LoginPage"
      });
    }
  },
  computed: {
    logoURL() {
      return "/images/login-image2.jpg";
    },
    signupRules() {
      const EMAIL_REGEXP = new RegExp(
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
      );
      // Letters only (no numbers or special chars)
      const NAME_REGEXP = new RegExp(/^[A-Za-z]+$/);

      return {
        required: (value) => !!value || "Required.",
        emailMatch: (value) => EMAIL_REGEXP.test(value.trim()) || "Invalid e-mail.",
        nameMatch: (value) => NAME_REGEXP.test(value.trim()) || "Insert letters only",
        // verifyPassword: (value) => value === this.userPassword1 || "Password do not match",
        passwordLength: (value) => value.length >= 6 || "Insert at at least 6 characters"
      };
    }
  },
  watch: {}
};
</script>

<style scoped>
.side-line {
  border: 1px solid black;
  background-color: rgb(38, 50, 56);
  height: 100%;
  width: 100%;
}
</style>
