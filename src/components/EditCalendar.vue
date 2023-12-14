<template>
  <ViewCards withActions>
    <template v-slot:card-title>Create New Event</template>
    <template v-slot:card-text>
      <v-form ref="eventForm">
        <!-- Selected date -->
        <v-text-field
          :model-value="selectedDate"
          label="Date"
          variant="outlined"
          readonly
          disabled
          density="comfortable"
          style="width: 50%"
          color="primary"
        ></v-text-field>
        <!-- Company's name -->
        <v-text-field
          v-model="companyName"
          label="Company"
          variant="outlined"
          density="comfortable"
          style="width: 50%"
          color="primary"
        ></v-text-field>
        <!-- Color pick -->
        <v-select
          v-model="pickedColor"
          variant="outlined"
          density="comfortable"
          label="Event Color"
          style="width: 50%"
          color="primary"
          :items="eventColors"
          chips
        >
          <template v-slot:chip="{ item }">
            <v-chip variant="flat" :color="showPickedColor" v-if="pickedColor">
              <p>{{ item.title }}</p>
            </v-chip>
          </template>
        </v-select>
        <!-- Participants -->
        <v-text-field
          v-model="participants"
          label="Participants"
          variant="outlined"
          density="comfortable"
          style="width: 50%"
          color="primary"
        ></v-text-field>
        <!-- Event description -->
        <v-textarea
          v-model="description"
          label="Description"
          variant="outlined"
          color="primary"
          :rules="[formRules.required]"
        ></v-textarea>
      </v-form>
    </template>
    <template v-slot:card-actions>
      <div class="pb-1">
        <v-btn color="primary" variant="flat" @click="onSave">Save</v-btn>
        <v-btn color="error" variant="outlined" @click="onReset">Reset</v-btn>
      </div>
    </template>
  </ViewCards>
</template>

<script>
// @ts-ignore
import ViewCards from "./ViewCards.vue";
import { CalendarEventColors } from "../utilities/consts";
import { useCalendarStore } from "../stores/calendar";
import { mapState, mapActions } from "pinia";

export default {
  components: { ViewCards },
  props: {
    selectedDate: {
      type: String,
      default: ""
    }
  },
  data: () => ({
    pickedColor: "",
    companyName: "",
    participants: "",
    description: ""
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useCalendarStore, ["createNewEvent"]),
    async onSave() {
      const { valid } = await this.$refs.eventForm.validate();

      if (valid) {
        this.createNewEvent({
          date: this.selectedDate,
          color: this.pickedColor,
          company: this.companyName,
          participants: this.participants,
          description: this.description
        });
      }
    },
    onReset() {
      this.$refs.eventForm.reset();
    }
  },
  computed: {
    ...mapState(useCalendarStore, ["eventsList"]),
    eventColors() {
      return [
        { title: CalendarEventColors.Grey, color: "#475569" },
        { title: CalendarEventColors.Red, color: "#dc2626" },
        { title: CalendarEventColors.Orange, color: "#ea580c" },
        { title: CalendarEventColors.Yellow, color: "#ca8a04" },
        { title: CalendarEventColors.Green, color: "#16a34a" },
        { title: CalendarEventColors.Teal, color: "#0d9488" },
        { title: CalendarEventColors.Blue, color: "#2563eb" },
        { title: CalendarEventColors.Indigo, color: "#4f46e5" },
        { title: CalendarEventColors.Purple, color: "#9333ea" },
        { title: CalendarEventColors.Pink, color: "#db2777" }
      ];
    },
    showPickedColor() {
      let currentColor;
      if (this.pickedColor) {
        const isColorExist = this.eventColors.find((item) => {
          return this.pickedColor === item.title;
        });
        currentColor = isColorExist ? isColorExist.color : "";
      } else {
        currentColor = "";
      }

      return currentColor;
    },
    formRules() {
      return {
        required: (value) => !!value || "Field is required"
      };
    }
  },
  watch: {}
};
</script>

<style scoped></style>
