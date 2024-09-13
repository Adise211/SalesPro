<template>
  <v-dialog v-model="isDialogOpenLocaly" width="50%">
    <AppCard :cardContentOnly="false">
      <template v-slot:card-title>
        <div>New Note</div>
      </template>
      <template v-slot:card-text>
        <v-form ref="noteForm">
          <v-container>
            <!-- First Row -->
            <v-row>
              <!-- Title -->
              <v-col>
                <v-text-field
                  v-model="currentNote.title"
                  label="Title"
                  :rules="[formRules.required]"
                ></v-text-field>
              </v-col>
              <!-- Reffer to (company) -->
              <v-col cols="7">
                <v-autocomplete
                  v-model="currentNote.companyId"
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
                <v-textarea
                  v-model="currentNote.description"
                  label="Description"
                  :rows="4"
                ></v-textarea>
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
                      :rules="[formRules.required]"
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
                    v-model="selectedHour"
                    label="Time"
                    :items="hourOptions"
                    :rules="[formRules.required]"
                    style="width: 60%"
                  >
                  </v-select>
                  <v-select v-model="period" :items="['AM', 'PM']"> </v-select>
                </div>
              </v-col>
            </v-row>
            <!-- RemindMe Checkbox-->
            <v-checkbox
              v-model="currentNote.remindMe"
              label="Remind me"
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
import { mapState, mapActions } from "pinia";
import { useGeneralStore } from "@/stores/general";
import { createNewNote, updateNote } from "@/firebase/services/data";
import { ToastMessages } from "@/utilities/consts";
import { convertDate } from "@/utilities/utilsFuncs";
import { useDate } from "vuetify";

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
    isOnEditMode: {
      type: Boolean,
      default: false
    },
    selectedNote: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    isDialogOpenLocaly: false,
    isLoading: false,
    currentNote: { ...config.DataTemplates.NoteTemp },
    isDateMenuOpen: false,
    selectedHour: "",
    period: "AM"
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, [
      "setToastMessage",
      "addEventToStore",
      "updateUserNotesListInStore"
    ]),
    async onSaveData() {
      let APIRequest = createNewNote;
      let storeAction = this.addEventToStore;
      let currentToastMsg = ToastMessages.SuccessMessages.Created;

      // On edit note
      if (this.isOnEditMode) {
        APIRequest = updateNote;
        storeAction = this.updateUserNotesListInStore;
        currentToastMsg = ToastMessages.SuccessMessages.Updated;
      }
      const { valid } = await this.$refs.noteForm.validate();
      if (valid) {
        this.isLoading = true;
        // If it's a note with reminder - take the selected time value
        if (this.currentNote.remindMe) {
          this.currentNote.time = `${this.selectedHour} ${this.period}`;
          this.currentNote.date = convertDate(this.currentNote.date).MDYFormat;
        }
        const response = await APIRequest(this.currentNote);
        if (response && response.Result.Success) {
          console.log("SAVED DATA...", this.currentNote);
          // Show success toast
          this.setToastMessage({
            type: "success",
            message: currentToastMsg
          });
          // Update the list in store
          storeAction(response.Data);
        }
      }
      this.isLoading = false;
      // Reset
      this.onCancel();
    },
    resetCurrentNote() {
      this.currentNote = { ...config.DataTemplates.NoteTemp };
    },
    onCancel() {
      this.isDialogOpenLocaly = false;
      this.resetCurrentNote();
      console.log("EMOTY?", this.currentNote);
      this.$emit("onDialogClose");
    },
    changedDateFormat(date) {
      if (date) {
        return this.UseDate.format(this.currentNote.date, "keyboardDate");
      }
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["companiesList"]),
    displayDate() {
      return this.currentNote.date
        ? this.UseDate.format(this.currentNote.date, "keyboardDate")
        : "";
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
    },
    selectedNote(newData) {
      if (newData) {
        this.currentNote = newData;
        // If note has time - separte the value
        if (newData.time) {
          this.selectedHour = newData.time.split(" ")[0];
          this.period = newData.time.split(" ")[1];
        }
      } else {
        this.resetCurrentNote();
      }
    }
  }
};
</script>

<style scoped></style>
