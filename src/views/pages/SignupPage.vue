<template>
  <v-conainer fluid class="fill-height">
    <v-row class="fill-height">
      <v-spacer></v-spacer>
      <v-col md="3" class="my-auto">
        <v-form ref="signupForm">
          <!-- Email -->
          <v-text-field
            v-model="userEmail"
            placeholder="Email"
            :rules="[signupRules.required, signupRules.emailMatch]"
            validate-on="blur"
            variant="outlined"
            density="comfortable"
            style="width: 100%"
            color="primary"
          ></v-text-field>
          <!-- Password -->
          <v-text-field
            v-model="userPassword1"
            class="mt-1"
            placeholder="Password"
            :rules="[signupRules.required]"
            validate-on="blur"
            variant="outlined"
            density="comfortable"
            style="width: 100%"
            color="primary"
          ></v-text-field>
          <!-- Verify password -->
          <v-text-field
            v-model="userPassword2"
            class="mt-1"
            placeholder="Verify password"
            :rules="[signupRules.required, signupRules.verifyPassword]"
            validate-on="blur"
            variant="outlined"
            density="comfortable"
            style="width: 100%"
            color="primary"
          ></v-text-field>
          <!-- Fisrt name -->
          <v-text-field
            v-model="userFirstName"
            class="mt-1"
            placeholder="Name"
            :rules="[signupRules.required]"
            validate-on="blur"
            variant="outlined"
            density="comfortable"
            style="width: 100%"
            color="primary"
          ></v-text-field>
          <!-- Last name -->
          <v-text-field
            v-model="userLastName"
            class="mt-1"
            placeholder="Last name (optinal)"
            variant="outlined"
            density="comfortable"
            style="width: 100%"
            color="primary"
          ></v-text-field>
        </v-form>
        <div class="signup-actions d-flex flex-column align-center justify-center mt-5">
          <v-btn color="primary" variant="flat">Signup</v-btn>
        </div>
      </v-col>
      <v-spacer></v-spacer>
      <v-col md="4" class="my-auto">
        <div class="logo-img px-12">
          <v-img :src="logoURL" />
        </div>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </v-conainer>
</template>

<script>
export default {
  name: "SignupPage",
  components: {},
  props: {},
  data: () => ({
    userEmail: "",
    userPassword1: "",
    userPassword2: "",
    userFirstName: "",
    userLastName: ""
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    logoURL() {
      return "images/logo.png";
    },
    signupRules() {
      const emailRegex = new RegExp(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, "g");
      return {
        required: (value) => !!value || "Required.",
        emailMatch: (value) => emailRegex.test(value) || "Invalid e-mail.",
        verifyPassword: (value) => value === this.userPassword1 || "Not the same password"
      };
    }
  },
  watch: {}
};
</script>

<style scoped>
.logo-img {
  position: relative;
  bottom: 10vh;
}
</style>
