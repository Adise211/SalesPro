<template>
  <v-dialog v-model="isDialogOpenLocaly" width="50%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div>Create Note</div>
      </template>
      <template v-slot:card-text>
        <v-form ref="noteForm">
          <v-container>
            <!-- First Row -->
            <v-row>
              <!-- Title -->
              <v-col>
                <v-text-field label="Title" :rules="[formRules.required]"></v-text-field>
              </v-col>
              <!-- Reffer to (company) -->
              <v-col cols="7">
                <v-autocomplete
                  :items="companiesList"
                  item-title="companyName"
                  item-value="companyId"
                  placeholder="Reffer to"
                  variant="outlined"
                  color="primary"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <!-- Second Row -->
            <v-row>
              <!-- Description -->
              <v-col cols="7">
                <v-textarea label="Description" :rows="4"></v-textarea>
              </v-col>
              <v-col>
                <!-- Date -->
                <v-menu
                  v-if="currentNote.remindMe"
                  v-model="isDateMenuOpen"
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-bind="props"
                      label="Date"
                      :modelValue="displayDate"
                      class="mb-2"
                      :rules="currentNote.remindMe ? [formRules.required] : []"
                    >
                    </v-text-field>
                  </template>
                  <v-date-picker
                    hide-header
                    @update:modelValue="
                      (val) => {
                        isDateMenuOpen = false;
                        currentNote.date = val;
                      }
                    "
                  ></v-date-picker>
                </v-menu>
                <!-- Time -->
                <div v-if="currentNote.remindMe" class="d-flex">
                  <v-select
                    label="Time"
                    :items="hourOptions"
                    :rules="currentNote.remindMe ? [formRules.required] : []"
                    style="width: 60%"
                  >
                  </v-select>
                  <v-select v-model="dayPeriod" :items="['AM', 'PM']"> </v-select>
                </div>
              </v-col>
            </v-row>
            <!-- RemindMe Checkbox-->
            <v-checkbox
              label="Remind me"
              v-model="currentNote.remindMe"
              color="#eab308"
              density="compact"
              hide-details
            ></v-checkbox>
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
import config from "@/utilities/config";
import { mapState } from "pinia";
import { useGeneralStore } from "@/stores/general";

export default {
  components: { AppCard },
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isDialogOpenLocaly: false,
    isLoading: false,
    currentNote: { ...config.DataTemplates.NoteTemp },
    isDateMenuOpen: false,
    dayPeriod: "AM"
  }),
  created() {},
  mounted() {},
  methods: {
    async onSaveData() {
      console.log("SAVED DATA...", this.currentNote);
      this.onCancel();
    },
    onCancel() {
      this.isDialogOpenLocaly = false;
      this.$emit("onDialogClose");
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    displayDate() {
      return "";
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
    formRules() {
      return {
        required: (value) => !!value || "Field is required"
      };
    }
  },
  watch: {
    isDialogOpen(isOpen) {
      this.isDialogOpenLocaly = isOpen;
    }
  }
};
</script>

<style scoped></style>
