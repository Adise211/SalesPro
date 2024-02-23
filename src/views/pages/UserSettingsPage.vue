<template>
  <v-container fluid class="fill-height py-0">
    <v-row class="fill-height">
      <!-- list of settings options -->
      <v-col md="6">
        <ViewCards>
          <template v-slot:card-text>
            <v-list>
              <!-- Profile settings -->
              <v-list-subheader>Profile</v-list-subheader>
              <v-list-item
                v-for="(item, i) in profileSettingsItems"
                :key="i"
                :value="item"
                color="primary"
                @click="onSelectSetting(item.text)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
              <!-- App settings -->
              <v-list-subheader>App</v-list-subheader>
              <v-list-item
                v-for="(item, i) in appSettingsItems"
                :key="i"
                :value="item"
                color="primary"
                @click="onSelectSetting(item.text)"
              >
                <template v-slot:prepend>
                  <v-icon :icon="item.icon"></v-icon>
                </template>

                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
              <!-- Account settings -->
              <v-list-subheader>Account</v-list-subheader>
              <v-list-item
                v-for="(item, i) in accountSettingsItems"
                :key="i"
                :value="item"
                color="primary"
                @click="onSelectSetting(item.text)"
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
      <v-col md="6">
        <ViewCards cardTextFillHeight>
          <template v-slot:card-text>
            <AppSettingBoard :settingType="selectedSetting"></AppSettingBoard>
          </template>
        </ViewCards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ViewCards from "@/components/ViewCards.vue";
import AppSettingBoard from "@/components/AppSettingBoard.vue";
export default {
  name: "UserSettingsPage",
  components: { ViewCards, AppSettingBoard },
  props: {},
  data: () => ({
    selectedSetting: ""
  }),
  created() {},
  mounted() {},
  methods: {
    onSelectSetting(settingName) {
      this.selectedSetting = settingName.split(" ").join("");
    }
  },
  computed: {
    profileSettingsItems() {
      return [
        { text: "Profile Picture", icon: "mdi-account" },
        { text: "Full Name", icon: "mdi-pencil" }
      ];
    },
    appSettingsItems() {
      return [
        { text: "Theme", icon: "mdi-palette" },
        { text: "My Products", icon: "mdi-package-variant" }
      ];
    },
    accountSettingsItems() {
      return [
        { text: "Email", icon: "mdi-email-edit" },
        { text: "Password", icon: "mdi-lock" }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
