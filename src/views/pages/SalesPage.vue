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
              <v-btn color="blue-darken-1" variant="text" @click="isDialogOpen = true"
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
  <v-dialog v-model="isDialogOpen" width="70%" height="70%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <span class="text-h5">Create New Item</span>
      </template>
      <template v-slot:card-text>
        <v-form ref="form">
          <v-container>
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) company's name -->
                <v-text-field
                  label="Company's Name"
                  v-model="itemObject.companyName"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) email -->
                <v-text-field label="Email" v-model="itemObject.email"></v-text-field>
              </v-col>
              <v-col>
                <!-- 3) phone number -->
                <v-text-field label="Phone Number" v-model="itemObject.phoneNumber"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="5">
                <!-- 4) city or state -->
                <v-text-field label="State/City" v-model="itemObject.stateOrCity"></v-text-field>
              </v-col>
              <v-col md="5">
                <!-- 5) country -->
                <v-select
                  label="Country"
                  :items="['USA', 'Canada']"
                  v-model="itemObject.country"
                ></v-select>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <!-- 4) product -->
                <v-select
                  label="My Product"
                  :items="['q-99', 'Q-10']"
                  v-model="itemObject.myProduct"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="blue-darken-1" variant="text" @click="onSaveItem" :loading="isLoading"
            >Save</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="isDialogOpen = false">Cancel</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import TrackingBoard from "@/components/TrackingBoard.vue";
import AppCard from "@/components/AppCard.vue";
import { TrackingTypes } from "@/utilities/consts";
import config from "@/utilities/config";
import { createNewCompany } from "@/firebase/services/data";

export default {
  name: "SalesPage",
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
    searchExpression: "",
    itemObject: { ...config.DataTemplates.CompanyTemp },
    isLoading: false
  }),
  created() {},
  mounted() {},
  methods: {
    onToolbarItemClick(item) {
      // for bg color
      this.currentStageId = item.id;
      // for router path
      this.$router.push({
        name: "SalesPage",
        params: {
          stageName: item.value
        }
      });
    },
    async onSaveItem() {
      console.log("on save:", this.itemObject);
      this.isLoading = true;
      const response = await createNewCompany(this.itemObject);
      if (response.Result.Success) {
        console.log("saved data!", response);
      }
      this.isLoading = false;
      this.isDialogOpen = false;
      this.itemObject = { ...config.DataTemplates.CompanyTemp };
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
