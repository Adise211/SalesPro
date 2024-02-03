<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <!-- list of settings options -->
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <v-list>
              <v-list-subheader>Profile</v-list-subheader>
              <v-list-item
                v-for="(item, i) in profileSettingsItems"
                :key="i"
                :value="item"
                color="primary"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
              <v-list-subheader>App</v-list-subheader>
              <v-list-item class="theme-setting">
                <template v-slot:prepend>
                  <v-icon icon="mdi-account"></v-icon>
                </template>
                <v-list-item-title>Theme</v-list-item-title>
              </v-list-item>
              <v-list-subheader>Account</v-list-subheader>
              <v-list-item
                v-for="(item, i) in accountSettingsItems"
                :key="i"
                :value="item"
                color="primary"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </template>
        </ViewCards>
      </v-col>
      <!-- board for editing  -->
      <v-col md="6"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
export default {
  name: "UserSettingsPage",
  components: { ViewCards },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    profileSettingsItems() {
      return [
        { text: "Profile Picture", icon: "mdi-account" },
        { text: "Full Name", icon: "mdi-account" }
      ];
    },
    accountSettingsItems() {
      return [
        { text: "Email", icon: "mdi-account" },
        { text: "Password", icon: "mdi-account" }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
