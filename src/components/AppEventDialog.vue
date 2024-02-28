<template>
  <v-dialog v-model="isDialogOpen" width="60%">
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
                  v-model="eventTitle"
                  label="Event Title*"
                  :rules="[formRules.required]"
                ></v-text-field>
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
                    :rules="[formRules.required]"
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
                    :rules="[formRules.required]"
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
                <v-text-field
                  v-model="companyName"
                  label="Company's Name"
                  :rules="[formRules.required]"
                ></v-text-field>
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
          <v-btn color="blue-darken-1" variant="text" @click="onCancel">Cancel</v-btn>
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import AppCard from "./AppCard.vue";
import { useDate } from "vuetify";
import { convertTime, convertDate } from "@/utilities/utilsFuncs";
import { CalendarEventTemp, ToastMessages, CompanyTemp } from "@/utilities/consts";
import { createCalendarEvent, createNewCompany } from "@/firebase/services/data";
import { mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";

export default {
  setup() {
    const VuetifyUseDate = useDate();
    return { VuetifyUseDate };
  },
  components: { AppCard },
  props: {
    isParentReqToOpen: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isDialogOpen: false,
    isLoading: false,
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
    ...mapActions(useGeneralStore, ["addCalendarEventToStore"]),
    async onSaveData() {
      // Check if form is valid
      const { valid } = await this.$refs.eventForm.validate();
      if (valid) {
        this.isLoading = true;

        // Get dates with the next format : "YYYY-MM-DD HH:mm"
        const { fullStart, fullEnd } = this.getEventFullDates();
        // Clone the event template
        const newEvent = { ...CalendarEventTemp };
        // The new event info
        newEvent.start = fullStart;
        newEvent.end = fullEnd;
        newEvent.title = this.eventTitle;
        newEvent.description = this.eventDescription;
        newEvent.location = this.location;
        newEvent.people = this.people;

        const response = await createCalendarEvent(newEvent);
        console.log("res:", response);
        if (response.Result.Success) {
          const createdCompany = await this.createCompany(response.Data);
          console.log("createdCompany:", createdCompany);
          // Show toast
          this.$toast.open({
            type: "success",
            message: ToastMessages.SuccessMessages.Created
          });
          // Add to store
          this.addCalendarEventToStore(response.Data);
          // Reset
          this.onCancel();
        }
        this.isLoading = false;
      }
    },
    async createCompany(eventData) {
      // Clone template
      const company = { ...CompanyTemp };
      company.companyName = this.companyName;
      company.trackingStatus = 1;
      const response = await createNewCompany(company, eventData.id);
      if (response.Result.Success) {
        return response.Data;
      }
    },
    onCancel() {
      this.isDialogOpen = false;
      this.$refs.eventForm.reset();
      this.startDateValue = "";
      this.endDateValue = "";
      this.isFullDay = true;
      this.$emit("onDialogClose");
    },
    getEventFullDates() {
      let fullStart;
      let fullEnd;

      const startDateISO = convertDate(this.startDateValue).ISOFormat;
      const endDateISO = convertDate(this.endDateValue).ISOFormat;
      if (this.isFullDay) {
        fullStart = startDateISO;
        fullEnd = endDateISO;
      } else {
        const startTime = convertTime(`${this.startTime} ${this.startTimeInDay}`).time12hFormat;
        const endTime = convertTime(`${this.endTime} ${this.endTimeInDay}`).time12hFormat;

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
    formattedDatesForDisplay() {
      return {
        start: this.startDateValue
          ? this.VuetifyUseDate.format(this.startDateValue, "keyboardDate")
          : "",
        end: this.endDateValue ? this.VuetifyUseDate.format(this.endDateValue, "keyboardDate") : ""
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
        const start = this.VuetifyUseDate.date(this.startDateValue);
        const end = this.VuetifyUseDate.date(this.endDateValue);

        // Chack the range - start date is always the same OR before the end date
        isValidRange =
          this.VuetifyUseDate.isBefore(start, end) || this.VuetifyUseDate.isSameDay(start, end);
      }
      return isValidRange;
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
