<template>
  <v-dialog v-model="isDialogOpen" width="60%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <span class="text-h5">Create New Item</span>
      </template>
      <template v-slot:card-text>
        <v-form ref="eventForm">
          <v-container>
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) company's name -->
                <v-text-field label="Company's Name"></v-text-field>
              </v-col>
              <v-col>
                <!-- 2) location -->
                <v-text-field
                  v-model="location"
                  label="Location"
                  append-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col>
                <!-- 3) phone number -->
                <v-text-field label="Phone Number"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="5">
                <v-text-field label="Email"></v-text-field>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <v-select
                  label="My Product"
                  append-inner-icon="mdi-account-group"
                  :items="['q-99', 'Q-10']"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="blue-darken-1" variant="text" @click="onSaveData" :loading="isLoading"
            >Save</v-btn
          >
          <v-btn color="blue-darken-1" variant="text" @click="isDialogOpen = false">Cancel</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppCard from "./AppCard.vue";

export default {
  components: { AppCard },
  props: {},
  data: () => ({
    isDialogOpen: true
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
