<template>
  <v-container fluid class="pa-0 fill-height d-flex justify-center">
    <v-row>
      <v-col class="d-flex justify-center" cols="12">
        <v-card width="30%" elevation="3">
          <v-card-item>
            <div class="logo d-flex mt-10 justify-center">
              <v-icon color="primary">mdi-lighthouse-on</v-icon>
              <div class="font-weight-bold text-high-emphasis text-h5 text-uppercase">
                LightSale
              </div>
            </div>
          </v-card-item>
          <v-card-text class="pt-4 mx-4">
            <h4 class="text-h5 mb-1 text-high-emphasis">Adventure starts here 🚀</h4>
            <p class="mb-0 font-weight-meduim text-high-emphasis">
              Make your sale management easy and fun!
            </p>
          </v-card-text>
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
              <v-checkbox label="Remember me"></v-checkbox>
              <v-btn color="primary" block>Signup</v-btn>
              <div class="mt-5 text-center">
                <span class="font-weight-meduim text-high-emphasis">Already have an account? </span>
                <a class="text-primary">Sign in instead</a>
              </div>
              <div class="v-col v-col-12 d-flex align-center">
                <hr
                  class="v-divider v-theme--light"
                  aria-orientation="horizontal"
                  role="separator"
                />
                <span class="mx-4">or</span>
                <hr
                  class="v-divider v-theme--light"
                  aria-orientation="horizontal"
                  role="separator"
                />
              </div>
              <div class="v-col v-col-12 text-center">
                <v-icon color="blue" class="mx-1">mdi-facebook</v-icon>
                <v-icon color="red" class="mx-1">mdi-gmail</v-icon>
                <v-icon color="purple" class="mx-1">mdi-yahoo</v-icon>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { checkIfUserExistWByEmail, createNewUser } from "@/firebase/services/user";

export default {
  name: "SignupPage",
  components: {},
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
