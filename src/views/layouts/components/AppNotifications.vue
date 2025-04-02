<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-bell-outline"> </v-btn>
    </template>
    <v-list width="380" lines="two">
      <v-list-item class="menu-title">
        <v-list-item-title class="d-flex justify-space-between">
          <p class="text-h6 text-high-emphasis">Notification</p>
          <div class="title-actions d-flex align-center justify-space-between">
            <v-chip color="primary" variant="tonal">4 new</v-chip>

            <v-tooltip :text="readAllTooltipText" location="bottom">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props"> mdi-email-open-outline </v-icon>
              </template>
            </v-tooltip>
          </div>
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <template v-for="(item, index) in notificationsList" :key="item.id">
        <v-list-item density="comfortable" link class="mx-1" slim>
          <v-list-item-title class="d-flex align-center justify-space-between">
            <span class="not-item-title">{{ item.title }}</span>
            <small class="mb-4 text-primary">{{ convertToTime(item.epochTime) }}</small>
          </v-list-item-title>
          <v-list-item-subtitle class="d-flex justify-space-between">
            <span>{{ item.subtitle }}</span>
            <div>
              <v-badge v-if="!item.isRead" color="primary" dot class="mb-2 mr-1"></v-badge>
            </div>
          </v-list-item-subtitle>
          <!-- <template v-slot:prepend>
            <v-badge v-if="index != 2" color="primary" dot class="mr-2"> </v-badge>
          </template> -->
        </v-list-item>
        <v-divider v-if="index != notificationsList.length - 1"></v-divider>
      </template>
    </v-list>
  </v-menu>
</template>

<script>
import { convertEpochMilliToTimeFromNow } from "@/utilities/utilsFuncs";

export default {
  components: {},
  props: {},
  data: () => ({
    readAllTooltipText: "Mark all as read"
  }),
  created() {},
  mounted() {
    console.log("test:", this.convertToTime(1711914883000));
  },
  methods: {
    convertToTime(val) {
      return convertEpochMilliToTimeFromNow(val);
    }
  },
  computed: {
    notificationsList() {
      return [
        {
          id: 1,
          title: "Test 1",
          subtitle: "Some text for test",
          epochTime: 1743448670000,
          isRead: false
        },
        {
          id: 2,
          title: "Test 2",
          subtitle: "Some text for test",
          epochTime: 1743448670000,
          isRead: false
        },
        {
          id: 3,
          title: "Test 3",
          subtitle: "Some text for test",
          epochTime: 1743448670000,
          isRead: true
        }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped>
.title-actions {
  width: 30%;
}
</style>
