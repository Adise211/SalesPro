<template>
  <v-container class="files-page h-100 pa-3" style="max-height: 100%">
    <AppCard>
      <template v-slot:card-text>
        <v-data-table-virtual>
          <!-- table top -->
          <template v-slot:top>
            <v-row class="mb-5">
              <v-col cols="4">
                <v-text-field
                  v-model="searchExpression"
                  hide-details
                  single-line
                  density="compact"
                  variant="solo-filled"
                  flat
                  placeholder="Search here..."
                  append-inner-icon="mdi-magnify"
                ></v-text-field>
              </v-col>
              <v-col class="text-end">
                <v-btn
                  color="primary"
                  variant="text"
                  prepend-icon="mdi-plus"
                  @click="isDialogOpen = true"
                  >Add File</v-btn
                >
              </v-col>
            </v-row>
          </template>
        </v-data-table-virtual>
      </template>
    </AppCard>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";

export default {
  name: "FilesPage",
  components: { AppCard },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
