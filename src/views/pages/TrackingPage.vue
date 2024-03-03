<template>
  <v-container fluid>
    <v-row>
      <v-col md="12" class="pa-3">
        <AppCard :cardTextClass="'py-0'">
          <template v-slot:card-text>
            <v-toolbar color="white" height="80">
              <v-text-field
                hide-details
                single-line
                placeholder="Search here..."
                append-inner-icon="mdi-magnify"
              ></v-text-field>
              <v-spacer></v-spacer>

              <v-toolbar-items>
                <v-btn
                  v-for="item in toolbarItems"
                  :key="item.id"
                  @click="onToolbarItemClick(item)"
                  :class="{ 'bg-blue-lighten-1': item.id == currentStageId }"
                  >{{ item.title }}</v-btn
                >
              </v-toolbar-items>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="outlined">Create New</v-btn>
            </v-toolbar>
          </template>
        </AppCard>
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col md="12" class="pt-0">
        <AppCard>
          <template v-slot:card-text>
            <TrackingBoard :currentStageName="stageName"></TrackingBoard>
          </template>
        </AppCard>
      </v-col>
    </v-row>
  </v-container>
  <!-- Create new Company (item) Dialog -->
  <v-dialog v-model="isDialogOpen">
    <AppCard>
      <template v-slot:card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import TrackingBoard from "@/components/TrackingBoard.vue";
import AppCard from "@/components/AppCard.vue";
import { TrackingTypes } from "@/utilities/consts";

export default {
  name: "TrackingPage",
  components: { AppCard, TrackingBoard },
  props: {
    stageName: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    isDialogOpen: false,
    currentStageId: 1
  }),
  created() {},
  mounted() {},
  methods: {
    onToolbarItemClick(item) {
      // for bg color
      this.currentStageId = item.id;
      // for router path
      this.$router.push({
        name: "TrackingPage",
        params: {
          stageName: item.value
        }
      });
    }
  },
  computed: {
    toolbarItems() {
      const list = [];
      for (let item in TrackingTypes) {
        list.push(TrackingTypes[item]);
      }
      return list;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
