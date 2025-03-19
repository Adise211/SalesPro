<template>
  <v-container fluid class="customers-page h-100 pa-3" style="max-height: 100%">
    <AppCard>
      <template v-slot:card-text>
        <v-data-table-virtual
          :headers="tableHeaders"
          :items="tableItems"
          fixed-header
          :height="490"
        >
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
                  >Add Customer</v-btn
                >
              </v-col>
            </v-row>
          </template>
          <!-- table body -->
          <template v-slot:[`item.LastUpdated`]="{ item }">
            <td>{{ convertEpochToDateFormat(item.LastUpdated) }}</td>
          </template>
        </v-data-table-virtual>
      </template>
    </AppCard>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import { TableColumnsWidthValue } from "@/utilities/consts.js";
import { convertEpochMilliToDate } from "@/utilities/utilsFuncs";

export default {
  name: "CustomersPage",
  components: { AppCard },
  props: {},
  data: () => ({
    searchExpression: ""
  }),
  created() {},
  mounted() {},
  methods: {
    convertEpochToDateFormat(value) {
      return convertEpochMilliToDate(value);
    }
  },
  computed: {
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "Company",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Email",
          key: "Email",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Phone",
          key: "Phone",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Business Sector",
          key: "BusinessSector",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Updated By",
          key: "UpdatedBy",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Updated Time",
          key: "LastUpdated",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Actions",
          key: "",
          align: "center",
          width: TableColumnsWidthValue.Small,
          sortable: false
        }
      ];
    },
    tableItems() {
      return [];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
