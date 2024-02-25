<template>
  <v-dialog v-model="isDialogOpen" width="60%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <span class="text-h5">Create Event</span>
      </template>
      <template v-slot:card-text>
        <v-form ref="event-info-form">
          <v-container>
            <!-- First Row -->
            <v-row>
              <v-col>
                <v-text-field label="Start Date*"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="End Date*"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Event Title*"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="3">
                <v-checkbox label="Full day" v-model="isFullDay" color="blue-darken-1"></v-checkbox>
              </v-col>
              <v-col>
                <div v-if="!isFullDay" class="d-flex">
                  <v-select label="Start time"></v-select>
                  <v-select></v-select>
                </div>
              </v-col>
              <v-col>
                <div v-if="!isFullDay" class="d-flex">
                  <v-select label="End time"></v-select>
                  <v-select></v-select>
                </div>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <v-textarea label="Description"></v-textarea>
              </v-col>
            </v-row>
            <!-- Forth Row -->
            <v-row>
              <v-col>
                <v-text-field label="People" append-inner-icon="mdi-account-group"></v-text-field>
              </v-col>
              <v-col>
                <v-text-field label="Location" append-inner-icon="mdi-map-marker"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text">Save</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="onCancel">Cancel</v-btn>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppCard from "./AppCard.vue";

export default {
  components: { AppCard },
  props: {
    isParentReqToOpen: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isDialogOpen: true,
    isFullDay: false
  }),
  created() {},
  mounted() {},
  methods: {
    onCancel() {
      this.isDialogOpen = false;
      this.$emit("onDialogClose");
    }
  },
  computed: {},
  watch: {
    isParentReqToOpen: {
      handler(isReq) {
        if (isReq) {
          this.isDialogOpen = true;
        } else {
          this.isDialogOpen = false;
        }
      }
    }
  }
};
</script>

<style scoped></style>
