<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" icon="mdi-bell-outline"> </v-btn>
    </template>
    <v-list width="250" lines="three">
      <v-list-item
        v-for="item in notificationsList"
        :key="item.id"
        :title="item.title"
        :subtitle="item.subtitle"
        density="comfortable"
      >
        <template v-slot:append>
          <v-list-item-action class="flex-column align-end">
            <small class="mb-4 text-high-emphasis opacity-60">{{
              convertToTime(item.epochTime)
            }}</small>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { convertEpochMilliToTimeFromNow } from "@/utilities/utilsFuncs";

export default {
  components: {},
  props: {},
  data: () => ({}),
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
        { id: 1, title: "Test 1", subtitle: "Some text for test", epochTime: 1743448670000 },
        { id: 2, title: "Test 1", subtitle: "Some text for test", epochTime: 1743448670000 },
        { id: 3, title: "Test 1", subtitle: "Some text for test", epochTime: 1743448670000 }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
