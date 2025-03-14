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
                <v-btn
                  color="primary"
                  variant="text"
                  prepend-icon="mdi-plus"
                  @click="isDialogOpen = true"
                  >Add Product</v-btn
                >
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
  <v-dialog v-model="isDialogOpen">
    <AppCard :cardContentOnly="false" width="30%" height="85%">
      <template v-slot:card-title>
        <div>Add Product</div>
      </template>
      <template v-slot:card-text>
        <v-form ref="form">
          <v-text-field
            label="Product Name"
            maxLength="25"
            :rules="[formRules.required]"
          ></v-text-field>
          <v-textarea label="About The Product" maxLength="150" counter></v-textarea>
        </v-form>
      </template>

      <template v-slot:card-actions>
        <v-spacer></v-spacer>
        <div class="pb-3">
          <v-btn color="primary" variant="text" @click="onDialogClose">Cancel</v-btn>

          <v-btn color="primary" variant="flat" @click="onSaveItem" :loading="isLoading"
            >Save</v-btn
          >
        </div>
      </template>
    </AppCard>
  </v-dialog>
</template>

<script>
import { mapActions } from "pinia";
import AppCard from "@/components/AppCard.vue";
import { createNewProduct } from "@/firebase/services/data";
import { useGeneralStore } from "@/stores/general";
import { ToastMessages } from "@/utilities/consts";

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
    currentProduct: NEW_PRODUCT_OPBJECT,
    isDialogOpen: false,
    isLoading: false
  }),
  created() {},
  mounted() {},
  methods: {
    ...mapActions(useGeneralStore, ["setToastMessage", "addProductToListInStore"]),
    async onSaveItem() {
      let toastType;
      let toastMessage;

      const { valid } = await this.$refs.form.validate();
      if (valid) {
        this.isLoading = true;
        const response = await createNewProduct(this.currentProduct);
        // Add to store + show success toast message
        if (response.Result.ResultCode > 0) {
          toastType = "success";
          toastMessage = ToastMessages.SuccessMessages.Created;
          this.addProductToListInStore(response.Data);
        }

        // End loading and close dialog
        this.isLoading = false;
        this.setToastMessage({
          type: toastType,
          message: toastMessage
        });
        this.onDialogClose();
      }
    },
    onDialogClose() {
      this.isDialogOpen = false;
      this.currentProduct = NEW_PRODUCT_OPBJECT;
    }
  },
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
