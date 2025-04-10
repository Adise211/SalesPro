<template>
  <AuthLayout>
    <AuthCardHeader signup />
    <v-card-text class="mx-4">
      <v-form>
        <v-text-field
          variant="outlined"
          label="Username"
          placeholder="John Doe"
          type="text"
        ></v-text-field>
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
    showPassword1: false,
    showPassword2: false,
    userEmail: "",
    userPassword1: "",
    userPassword2: "",
    userFirstName: "",
    userLastName: "",
    userWorkspace: "",
    userRole: "",
    isLoading: false,
    windowSteps: {
      One: 1,
      Two: 2,
      Three: 3,
      Four: 4
    },
    currentWindowStep: 1,
    errorMessage: ""
  }),
  created() {},
  mounted() {},
  methods: {
    async onSignupClick() {
      switch (this.currentWindowStep) {
        case this.windowSteps.One:
          if (await this.isFormValid("emailForm")) this.checkIfUserExist();
          break;
        case this.windowSteps.Two:
          if (await this.isFormValid("workspaceForm")) this.nextWindowStep();
          break;
        case this.windowSteps.Three:
          if (await this.isFormValid("fullNameForm")) this.signupHandler();
          break;
        default:
          break;
      }
    },
    async checkIfUserExist() {
      const response = await checkIfUserExistWByEmail({
        Email: this.userEmail
      });

      if (response.Result.ResultCode > 0) {
        this.errorMessage = "";
        this.nextWindowStep();
      } else {
        this.errorMessage = response?.Result?.ResultMessage || "Something went wrong";
      }
    },
    async signupHandler() {
      this.isLoading = true;
      const newUserData = {
        Email: this.userEmail,
        Password: this.userPassword1,
        FirstName: this.userFirstName,
        LastName: this.userLastName,
        WorkSpaceName: this.userWorkspace,
        Role: this.userRole
      };
      const response = await createNewUser(newUserData);
      console.log("create new user response:", response);
      if (response.Result.ResultCode > 0) {
        this.isLoading = false;
        this.nextWindowStep();
      }
    },
    nextWindowStep() {
      this.currentWindowStep = this.currentWindowStep + 1;
    },
    async isFormValid(formName) {
      const { valid } = await this.$refs[formName].validate();
      return valid;
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
        verifyPassword: (value) => value === this.userPassword1 || "Password do not match",
        passwordLength: (value) => value.length >= 6 || "Insert at at least 6 characters"
      };
    },
    signupButtonTitle() {
      let title;
      switch (this.currentWindowStep) {
        case this.windowSteps.One:
          title = "Signup";
          break;
        case this.windowSteps.Two:
          title = "Next";
          break;
        case this.windowSteps.Three:
          title = "Next";
          break;
        case this.windowSteps.Four:
          title = "Signup";
          break;
        default:
          title = "Next";
          break;
      }
      return title;
    }
  },
  watch: {}
};
</script>

<style scoped>
/* .logo-img {
  position: relative;
  bottom: 14vh;
} */

.side-line {
  border: 1px solid black;
  background-color: rgb(38, 50, 56);
  height: 100%;
  width: 100%;
}
</style>
