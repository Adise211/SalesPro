<template>
  <v-container fluid>
    <AppCard>
      <template v-slot:card-text>
        <v-data-table
          :headers="tableHeaders"
          :page="page"
          :items-per-page="itemsPerPage"
          :search="searchExpression"
        >
          <template v-slot:top>
            <v-row class="mb-5">
              <v-col cols="3">
                <v-text-field
                  v-model="searchExpression"
                  placeholder="Search here..."
                  append-inner-icon="mdi-magnify"
                  hide-details
                  single-line
                ></v-text-field>
              </v-col>
              <v-col class="text-end">
                <v-btn color="primary" variant="text" prepend-icon="mdi-plus">Add Product</v-btn>
              </v-col>
            </v-row>
          </template>
          <!-- table footer (paging) -->
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount"></v-pagination>
            </div>
          </template>
        </v-data-table>
      </template>
    </AppCard>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";

const NEW_PRODUCT_OPBJECT = {
  Name: null,
  Description: null,
  LastUpdated: null
};

export default {
  name: "ProductsPage",
  components: { AppCard },
  props: {},
  data: () => ({
    page: 1,
    itemsPerPage: "6",
    searchExpression: "",
    currentProduct: NEW_PRODUCT_OPBJECT
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    tableHeaders() {
      return [
        {
          title: "Index",
          key: ""
        },
        {
          title: "Name",
          key: "Name"
        },
        {
          title: "Description",
          key: "Description"
        },
        {
          title: "Last Updated",
          key: "LastUpdated"
        }
      ];
    },
    tableItems() {
      return [];
    },
    pageCount() {
      return Math.ceil(this.tableItems.length / this.itemsPerPage);
    }
  },
  watch: {}
};
</script>

<style scoped></style>
