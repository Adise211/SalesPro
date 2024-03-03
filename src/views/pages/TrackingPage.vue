<template>
  <v-container fluid>
    <v-row>
      <v-col md="12" class="pa-3">
        <AppCard :cardTextClass="'py-0'">
          <template v-slot:card-text>
            <v-toolbar color="white" height="80">
              <v-text-field
                v-model="searchExpression"
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
              <v-btn color="blue-darken-1" variant="outlined" @click="createNewHandler"
                >Create new</v-btn
              >
            </v-toolbar>
          </template>
        </AppCard>
      </v-col>
    </v-row>
    <v-row class="fill-height">
      <v-col md="12" class="pt-0">
        <AppCard>
          <template v-slot:card-text>
            <TrackingBoard
              :currentStageName="stageName"
              :searchExp="searchExpression"
            ></TrackingBoard>
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
import { TrackingTypes, CompanyTemp } from "@/utilities/consts";

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
    currentStageId: 1,
    searchExpression: ""
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
    },
    createNewHandler() {
      const newCompany = { ...CompanyTemp };
      newCompany.companyName = "";
      newCompany.statusId = this.currentStageId;
      newCompany.contactInfo = "";
      newCompany.comapnyLocation = "";
      newCompany.myProduct = newCompany.notes;
      newCompany.relatedEvents = [];
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
