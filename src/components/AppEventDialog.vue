<template>
  <v-dialog v-model="isDialogOpen" width="60%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <span class="text-h5">Create Event</span>
      </template>
      <template v-slot:card-text>
        <v-container>
          <v-form ref="eventInfoForm">
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) start date -->
                <v-menu v-model="startDateMenu" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      label="Start Date*"
                      :modelValue="displayFormattedDates.start"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    hide-header
                    @update:modelValue="
                      (val) => {
                        startDateMenu = false;
                        startDateValue = val;
                      }
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <!-- 2) end date -->
                <v-menu v-model="endDateMenu" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      label="End Date*"
                      :modelValue="displayFormattedDates.end"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    hide-header
                    @update:modelValue="
                      (val) => {
                        endDateMenu = false;
                        endDateValue = val;
                      }
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <!-- 3) event title -->
                <v-text-field v-model="eventTitle" abel="Event Title*"></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="3">
                <v-checkbox label="Full day" v-model="isFullDay" color="blue-darken-1"></v-checkbox>
              </v-col>
              <v-col>
                <div v-if="!isFullDay" class="d-flex">
                  <v-select
                    v-model="startTime"
                    label="Start time"
                    :items="hoursOption"
                    class="w-25"
                  ></v-select>
                  <v-select
                    v-model="startTimeInDay"
                    class="w-0 ml-2"
                    :items="beforeOrAfterMidDay"
                  ></v-select>
                </div>
              </v-col>
              <v-col>
                <div v-if="!isFullDay" class="d-flex">
                  <v-select
                    v-model="endTime"
                    label="End time"
                    :items="hoursOption"
                    class="w-25"
                  ></v-select>
                  <v-select
                    v-model="endTimeInDay"
                    class="w-0 ml-2"
                    :items="beforeOrAfterMidDay"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <v-textarea v-model="eventDescription" label="Description"></v-textarea>
              </v-col>
            </v-row>
            <!-- Forth Row -->
            <v-row>
              <v-col>
                <v-select
                  v-model="people"
                  label="People"
                  append-inner-icon="mdi-account-group"
                  multiple
                  :items="['Me', 'Boss']"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="location"
                  label="Location"
                  append-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field v-model="companyName" label="Company's Name"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
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
import { useDate } from "vuetify";

export default {
  components: { AppCard },
  props: {
    isParentReqToOpen: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isDialogOpen: false,
    isFullDay: true,
    eventTitle: "",
    startTimeInDay: "AM",
    endTimeInDay: "AM",
    startDateMenu: false,
    endDateMenu: false,
    startDateValue: "",
    endDateValue: "",
    startTime: "",
    endTime: "",
    eventDescription: "",
    companyName: "",
    people: [],
    location: ""
  }),
  created() {},
  mounted() {},
  methods: {
    onCancel() {
      this.isDialogOpen = false;
      // TODO: Reset form
      // this.$refs.eventInfoForm.reset();
      this.startDateValue = "";
      this.endDateValue = "";
      this.$emit("onDialogClose");
    }
  },
  computed: {
    beforeOrAfterMidDay() {
      return ["AM", "PM"];
    },
    hoursOption() {
      const fullDayHours = [];
      for (let hourIndex = 1; hourIndex < 13; hourIndex++) {
        // Check if the hour is not exist yet in the list
        if (!fullDayHours.includes(hourIndex.toString())) {
          // If not exist - add it as time
          fullDayHours.push(hourIndex + ":00");
          fullDayHours.push(hourIndex + ":30");
        }
      }
      return fullDayHours;
    },
    displayFormattedDates() {
      return {
        start: this.startDateValue ? useDate().format(this.startDateValue, "keyboardDate") : "",
        end: this.endDateValue ? useDate().format(this.endDateValue, "keyboardDate") : ""
      };
    }
  },
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
