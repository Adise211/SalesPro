<template>
  <v-avatar class="mx-3 app-cursor-pointer">
    <v-img alt="profile_photo" :src="userProfilePhotoDisplay" class="bg-white"></v-img>
    <v-menu activator="parent" location="bottom">
      <v-card width="250">
        <v-card-text class="pa-1">
          <v-list class="pb-0">
            <v-list-item
              :prepend-avatar="userProfilePhotoDisplay"
              :title="userFullName"
              :subtitle="userRole"
              class="mb-3"
            >
            </v-list-item>
            <v-divider></v-divider>
            <!-- Profile -->
            <v-list-item title="Profile" slim @click="onItemClick('profile')">
              <template v-slot:prepend>
                <v-icon size="large">mdi-account-outline</v-icon>
              </template>
            </v-list-item>
            <!-- Settings -->
            <v-list-item title="Settings" slim @click="onItemClick('settings')">
              <template v-slot:prepend>
                <v-icon size="large">mdi-cog-outline</v-icon>
              </template>
            </v-list-item>
            <v-list-item title="FAQ" slim @click="onItemClick('help')">
              <template v-slot:prepend>
                <v-icon size="large">mdi-help-circle-outline</v-icon>
              </template>
            </v-list-item>
            <!-- Logout -->
            <v-divider></v-divider>
            <v-list-item title="Logout" slim @click="onItemClick('logout')">
              <template v-slot:prepend>
                <v-icon size="large">mdi-logout</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-avatar>
</template>

<script>
import { mapState } from "pinia";
import { useSessionStore } from "@/stores/session";

export default {
  components: {},
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {
    onItemClick(action) {
      this.$emit("onItemClick", action);
    }
  },
  computed: {
    ...mapState(useSessionStore, [
      "userEmail",
      "userFullName",
      "userWorkSpace",
      "userRole",
      "userPhotoUrl"
    ]),
    userProfilePhotoDisplay() {
      return this.userPhotoUrl || "https://avatar.iran.liara.run/public/boy?username=Ash";
    }
  },
  watch: {}
};
</script>

<style scoped></style>
