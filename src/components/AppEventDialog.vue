<template>
  <v-dialog v-model="isDialogOpenLocally" width="60%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <span class="text-h5">Create Event</span>
      </template>
      <template v-slot:card-text>
        <v-form ref="eventForm">
          <v-container>
            <!-- First Row -->
            <v-row>
              <v-col>
                <!-- 1) start date -->
                <v-menu v-model="startDateMenu" :close-on-content-click="false">
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      label="Start Date*"
                      :modelValue="formattedDatesForDisplay.start"
                      :rules="[formRules.required, formRules.validRange]"
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
                      :modelValue="formattedDatesForDisplay.end"
                      :rules="[formRules.required, formRules.validRange]"
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
                <v-text-field
                  v-model="currentEventObj.title"
                  label="Event Title*"
                  :rules="[formRules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <v-col md="3">
                <v-checkbox
                  label="Full day"
                  v-model="currentEventObj.allDay"
                  color="blue-darken-1"
                ></v-checkbox>
              </v-col>
              <v-col>
                <div v-if="!currentEventObj.allDay" class="d-flex">
                  <v-select
                    v-model="startTime"
                    label="Start time"
                    :items="hourOptions"
                    :rules="[formRules.required]"
                    class="w-25"
                  ></v-select>
                  <v-select
                    v-model="startLocale12HVal"
                    class="w-0 ml-2"
                    :items="beforeOrAfterMidDay"
                  ></v-select>
                </div>
              </v-col>
              <v-col>
                <div v-if="!currentEventObj.allDay" class="d-flex">
                  <v-select
                    v-model="endTime"
                    label="End time"
                    :items="hourOptions"
                    :rules="[formRules.required]"
                    class="w-25"
                  ></v-select>
                  <v-select
                    v-model="endLocale12HVal"
                    class="w-0 ml-2"
                    :items="beforeOrAfterMidDay"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <v-textarea v-model="currentEventObj.description" label="Description"></v-textarea>
              </v-col>
            </v-row>
            <!-- Forth Row -->
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="currentEventObj.companyId"
                  label="Company's Name"
                  append-inner-icon="mdi-magnify"
                  :items="companiesList"
                  item-title="companyName"
                  item-value="companyId"
                  hint="Companies from sales board"
                  persistent-hint
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-select
                  v-model="currentEventObj.people"
                  label="People"
                  append-inner-icon="mdi-account-group"
                  multiple
                  :items="['Me', 'Boss']"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentEventObj.location"
                  label="Location"
                  append-inner-icon="mdi-map-marker"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="primary" variant="text" @click="onSaveData" :loading="isLoading"
            >Save</v-btn
          >
          <v-btn color="primary" variant="text" @click="onCancel">Cancel</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppCard from "./AppCard.vue";
import { useDate } from "vuetify";
import { convertTime, convertDate } from "@/utilities/utilsFuncs";
import { ToastMessages } from "@/utilities/consts";
import { createCalendarEvent, updateCalendarEvent } from "@/firebase/services/data";
import { mapActions, mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { Config } from "@/utilities/config";

export default {
  setup() {
    const UseDate = useDate();
    return { UseDate };
  },
  components: { AppCard },
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    },
    selectedEvent: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isDialogOpenLocally: false,
    isLoading: false,
    currentEventObj: { ...Config.DataTemplates.CalendarEventTemp },
    startLocale12HVal: "AM",
    endLocale12HVal: "AM",
    startDateMenu: false,
    endDateMenu: false,
    startDateValue: "",
    endDateValue: "",
    startTime: "",
    endTime: "",
    isOnEditMode: false
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, [
      "addCalendarEventToStore",
      "setToastMessage",
      "updateCalendarEventInStore"
    ]),
    async onSaveData() {
      let APIRequest = createCalendarEvent;
      let storeAction = this.addCalendarEventToStore;
      let currentToastMsg = ToastMessages.SuccessMessages.Created;

      if (this.isOnEditMode) {
        APIRequest = updateCalendarEvent;
        storeAction = this.updateCalendarEventInStore;
        currentToastMsg = ToastMessages.SuccessMessages.Updated;
      }

      // Check if form is valid
      const { valid } = await this.$refs.eventForm.validate();
      if (valid && this.currentEventObj) {
        this.isLoading = true;
        // Get dates with the next format : "YYYY-MM-DD HH:mm"
        const { fullStart, fullEnd } = this.getEventFullDates();
        this.currentEventObj.start = fullStart;
        this.currentEventObj.end = fullEnd;

        const response = await APIRequest(this.currentEventObj);
        if (response.Result.Success) {
          // Show success toast
          this.setToastMessage({
            type: "success",
            message: currentToastMsg
          });
          // Add to store, send to parent and reset
          storeAction(response.Data);
          this.$emit("addNewEvent", response.Data);
          this.onCancel();
        }
        // Stop loader
        this.isLoading = false;
      }
    },
    onCancel() {
      this.isDialogOpenLocally = false;
      this.$refs.eventForm.resetValidation();
      this.startDateValue = "";
      this.endDateValue = "";
      this.currentEventObj = { ...Config.DataTemplates.CalendarEventTemp };
      this.$emit("onDialogClose");
    },
    getEventFullDates() {
      let fullStart;
      let fullEnd;

      const startDateISO = convertDate(this.startDateValue).ISOFormat;
      const endDateISO = convertDate(this.endDateValue).ISOFormat;
      if (this.currentEventObj.allDay) {
        fullStart = startDateISO;
        fullEnd = endDateISO;
      } else {
        const startTime = convertTime(`${this.startTime} ${this.startLocale12HVal}`).time12hFormat;
        const endTime = convertTime(`${this.endTime} ${this.endLocale12HVal}`).time12hFormat;

        fullStart = `${startDateISO} ${startTime}`;
        fullEnd = `${endDateISO} ${endTime}`;
      }

      return {
        fullStart,
        fullEnd
      };
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    beforeOrAfterMidDay() {
      return ["AM", "PM"];
    },
    hourOptions() {
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
    formattedDatesForDisplay() {
      return {
        start: this.startDateValue ? this.UseDate.format(this.startDateValue, "keyboardDate") : "",
        end: this.endDateValue ? this.UseDate.format(this.endDateValue, "keyboardDate") : ""
      };
    },
    formRules() {
      return {
        required: (value) => !!value || "Field is required",
        validRange: () => this.isDateInValidRange || "Invalid range"
      };
    },
    isDateInValidRange() {
      let isValidRange = true;
      // If there are start date and end date
      if (this.startDateValue && this.endDateValue) {
        const start = this.UseDate.date(this.startDateValue);
        const end = this.UseDate.date(this.endDateValue);

        // Chack the range - start date is always the same OR before the end date
        isValidRange = this.UseDate.isBefore(start, end) || this.UseDate.isSameDay(start, end);
      }
      return isValidRange;
    }
  },
  watch: {
    isDialogOpen: {
      handler(isOpen) {
        this.isDialogOpenLocally = isOpen;
      }
    },
    selectedEvent(newData) {
      if (newData) {
        this.currentEventObj = Object.assign(this.currentEventObj, newData.appEvent);
        this.isOnEditMode = true;

        const { appEvent } = newData;
        const { start, end } = appEvent;
        this.startDateValue = convertDate(start).MDYFormat;
        this.endDateValue = convertDate(end).MDYFormat;
        this.startTime = !appEvent.allDay ? start.split(" ")[1] : "";
        this.endTime = !appEvent.allDay ? end.split(" ")[1] : "";
      } else {
        this.isOnEditMode = false;
      }
    }
  }
};
</script>

<style scoped></style>
