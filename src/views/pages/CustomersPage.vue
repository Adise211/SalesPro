<template>
  <v-container class="customers-page h-100 pa-5" style="max-height: 100%">
    <AppCard>
      <template v-slot:card-text>
        <v-data-table-virtual
          :headers="tableHeaders"
          :items="tableItems"
          item-value="Id"
          fixed-header
          :height="490"
          :search="searchExpression"
          hover
          show-select
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
          <template v-slot:[`item.Company`]="{ item }">
            <td>
              <v-hover v-slot="{ isHovering, props }">
                <span
                  class="app-cursor-pointer"
                  :class="{ 'text-decoration-underline text-blue': isHovering }"
                  @click="openItemMoreInfo(item)"
                  v-bind="props"
                  >{{ item.Company }}</span
                >
              </v-hover>
            </td>
          </template>
          <template v-slot:[`item.PaymentStatus`]="{ value }">
            <v-chip
              :border="`orange thin opacity-25`"
              color="orange"
              :text="value === 0 ? 'Pending' : 'Paid'"
              size="x-small"
            ></v-chip>
          </template>
          <template v-slot:[`item.LastUpdated`]="{ item }">
            <td>
              <span class="ml-2">{{ convertEpochToDateFormat(item.LastUpdated) }}</span>
            </td>
          </template>
          <template v-slot:[`item.Actions`]="{ item }">
            <td>
              <div class="ml-3">
                <v-icon size="small" @click="onEditItem(item)">mdi-pencil</v-icon>
                <v-icon size="small" color="error" class="ml-2" @click="onDeleteItem(item)"
                  >mdi-delete</v-icon
                >
              </div>
            </td>
          </template>
        </v-data-table-virtual>
      </template>
    </AppCard>
    <v-dialog v-model="isContactDialogOpen" width="35%">
      <CustomerInfoCard
        :selectedItem="selectedItem"
        @onCloseContactDialog="closeContactDialogHandler"
      ></CustomerInfoCard>
    </v-dialog>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";
import CustomerInfoCard from "@/components/CustomerInfoCard.vue";
import { TableColumnsWidthValue } from "@/utilities/consts.js";
import { convertEpochMilliToDate } from "@/utilities/utilsFuncs";
import customers from "/public/_config/dummyDate/customers.json";

export default {
  name: "CustomersPage",
  components: { AppCard, CustomerInfoCard },
  props: {},
  data: () => ({
    searchExpression: "",
    isContactDialogOpen: false,
    selectedItem: null
  }),
  created() {},
  mounted() {},
  methods: {
    openItemMoreInfo(item) {
      console.log("open more info", item);
      this.isContactDialogOpen = true;
      this.selectedItem = item;
    },
    onEditItem(item) {
      console.log("edit item:", item);
    },
    onDeleteItem(item) {
      console.log("delete item:", item);
    },
    convertEpochToDateFormat(value) {
      return convertEpochMilliToDate(value);
    },
    closeContactDialogHandler() {
      this.isContactDialogOpen = false;
    }
  },
  computed: {
    tableHeaders() {
      return [
        {
          title: "Company",
          key: "Company",
          align: "start",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Business Sector",
          key: "BusinessSector",
          width: TableColumnsWidthValue.Medium
        },
        {
          title: "Email",
          key: "Email",
          width: TableColumnsWidthValue.Large
        },
        {
          title: "Last Bill",
          key: "LastBill",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Status",
          key: "PaymentStatus",
          width: TableColumnsWidthValue.Small
        },

        {
          title: "Updated By",
          key: "UpdatedBy",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Updated Date",
          key: "LastUpdated",
          width: TableColumnsWidthValue.Small
        },
        {
          title: "Actions",
          key: "Actions",
          align: "center",
          width: TableColumnsWidthValue.XSmall,
          sortable: false
        }
      ];
    },
    tableItems() {
      return customers;
    }
  },
  watch: {}
};
</script>

<style scoped></style>
