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
                      readonly
                      :modelValue="startDateDisplay"
                      :rules="[formRules.required, formRules.validRange]"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    hide-header
                    @update:modelValue="
                      (val) => {
                        startDateMenu = false;
                        startDateVal = val;
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
                      readonly
                      :modelValue="endDateDisplay"
                      :rules="[formRules.required, formRules.validRange]"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    hide-header
                    @update:modelValue="
                      (val) => {
                        endDateMenu = false;
                        endDateVal = val;
                      }
                    "
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col>
                <!-- 3) event title -->
                <v-text-field
                  v-model="currentEvent.Title"
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
                  v-model="currentEvent.AllDay"
                  color="blue-darken-1"
                  @update:modelValue="resetTimeFields"
                ></v-checkbox>
              </v-col>
              <v-col>
                <div v-if="!currentEvent.AllDay" class="d-flex">
                  <v-select
                    v-model="startHour"
                    label="Start time"
                    :items="hourOptions"
                    :rules="[formRules.required]"
                    class="w-25"
                  ></v-select>
                  <v-select
                    class="w-0 ml-2"
                    :items="time12HoursStringOptions"
                    placeholder="AM"
                    @update:modelValue="
                      (val) => {
                        startTimeVal = startHour + ' ' + val;
                      }
                    "
                    :rules="startHour ? [formRules.required] : []"
                  ></v-select>
                </div>
              </v-col>
              <v-col>
                <div v-if="!currentEvent.AllDay" class="d-flex">
                  <v-select
                    v-model="endHour"
                    label="End time"
                    :items="hourOptions"
                    :rules="[formRules.required]"
                    class="w-25"
                  ></v-select>
                  <v-select
                    class="w-0 ml-2"
                    :items="time12HoursStringOptions"
                    placeholder="AM"
                    @update:modelValue="
                      (val) => {
                        endTimeVal = endHour + ' ' + val;
                      }
                    "
                    :rules="endHour ? [formRules.required] : []"
                  ></v-select>
                </div>
              </v-col>
            </v-row>
            <!-- Third Row -->
            <v-row>
              <v-col>
                <v-textarea v-model="currentEvent.Description" label="Description"></v-textarea>
              </v-col>
            </v-row>
            <!-- Forth Row -->
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="currentEvent.CustomerId"
                  label="Customer (optinal)"
                  append-inner-icon="mdi-magnify"
                  :items="companiesList"
                  item-title="companyName"
                  item-value="companyId"
                  persistent-hint
                ></v-autocomplete>
              </v-col>
              <v-col>
                <v-select
                  v-model="currentEvent.Team"
                  label="Team (optinal)"
                  append-inner-icon="mdi-account-group"
                  multiple
                  :items="['Me', 'Boss']"
                ></v-select>
              </v-col>
              <v-col>
                <v-text-field
                  v-model="currentEvent.Location"
                  label="Location (optinal)"
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
          <v-btn color="primary" variant="text" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="onSaveData" :loading="isLoading"
            >Save</v-btn
          >
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppCard from "./AppCard.vue";
import { useDate } from "vuetify";
import { convertDate, convertTime } from "@/utilities/utilsFuncs";
import { ToastMessages } from "@/utilities/consts";
import { createCalendarEvent, updateCalendarEvent } from "@/firebase/services/workspace";
import { mapActions, mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";

const NEW_EVENT_OBJECT = {
  Id: null,
  AllDay: false,
  Start: null,
  End: null,
  Title: "",
  Description: null,
  Location: null,
  Color: null,
  Team: [],
  CustomerId: null
};

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
    currentEvent: { ...NEW_EVENT_OBJECT },
    startDateMenu: false,
    endDateMenu: false,
    startDateVal: "",
    endDateVal: "",
    startHour: "",
    endHour: "",
    startTimeVal: "",
    endTimeVal: "",
    isEditMode: false
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["setToastMessage"]),
    async onSaveData() {
      // Check if form is valid
      const { valid } = await this.$refs.eventForm.validate();

      if (valid && this.currentEvent) {
        this.isLoading = true;
        // Convert dates and time to the next format : "YYYY-MM-DD HH:mm"
        const SELECTED_START_DATE = `${convertDate(this.startDateVal).ISOFormat} ${
          convertTime(this.startTimeVal).time24hFormat
        }`.trim();
        const SELECTED_END_DATE = `${convertDate(this.endDateVal).ISOFormat} ${
          convertTime(this.endTimeVal).time24hFormat
        }`.trim();

        this.currentEvent.Start = SELECTED_START_DATE;
        this.currentEvent.End = SELECTED_END_DATE;
        console.log("current event ->", this.currentEvent);

        // Create or update event depend on the mode
        if (!this.isEditMode) {
          await this.createNewEvent();
        } else {
          await this.updateEvent();
        }

        // Stop loader and close dialog
        this.isLoading = false;
        this.closeDialog();
      }
    },
    async createNewEvent() {
      const response = await createCalendarEvent(this.currentEvent);
      if (response.Result.ResultCode > 0) {
        // Send to parent
        this.$emit("addNewEvent", response.Data);
        // Show success toast
        this.setToastMessage({
          type: "success",
          message: ToastMessages.SuccessMessages.Created
        });
      } else {
        this.setToastMessage({
          type: "error",
          message: ToastMessages.ErrorMessages.Created
        });
      }
    },
    async updateEvent() {
      const response = await updateCalendarEvent(this.currentEvent);
      if (response.Result.ResultCode > 0) {
        // Send to parent
        this.$emit("addNewEvent", response.Data);
        // Show success toast
        this.setToastMessage({
          type: "success",
          message: ToastMessages.SuccessMessages.Updated
        });
      } else {
        this.setToastMessage({
          type: "error",
          message: ToastMessages.ErrorMessages.Updated
        });
      }
    },
    closeDialog() {
      this.isDialogOpenLocally = false;
      this.$refs.eventForm.resetValidation();
      this.startDateVal = "";
      this.endDateVal = "";
      this.startHour = "";
      this.endHour = "";
      this.startTimeVal = "";
      this.endTimeVal = "";
      this.currentEvent = { ...NEW_EVENT_OBJECT };
      this.$emit("onDialogClose");
    },
    resetTimeFields(isAllDay) {
      if (isAllDay) {
        // Reset fields if allDay is set to true
        this.startHour = "";
        this.startTimeVal = "";
        this.endHour = "";
        this.endTimeVal = "";
      }
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    time12HoursStringOptions() {
      return ["AM", "PM"];
    },
    hourOptions() {
      const hours = [];
      for (let hourIndex = 1; hourIndex < 13; hourIndex++) {
        // Check if hour not exist in the list
        if (!hours.includes(hourIndex.toString())) {
          // If not exist - add it
          hours.push(hourIndex + ":00");
          hours.push(hourIndex + ":30");
        }
      }
      return hours;
    },
    startDateDisplay() {
      return this.startDateVal ? convertDate(this.startDateVal).MDYFormat : "";
    },
    endDateDisplay() {
      return this.endDateVal ? convertDate(this.endDateVal).MDYFormat : "";
    },
    formRules() {
      return {
        required: (value) => !!value || "Required.",
        validRange: () => this.isDateInValidRange || "Invalid range"
      };
    },
    isDateInValidRange() {
      let isValidRange = true;
      // If there are start date and end date
      if (this.startDateVal && this.endDateVal) {
        const start = this.UseDate.date(this.startDateVal);
        const end = this.UseDate.date(this.endDateVal);

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
    }
  }
};
</script>

<style scoped></style>
