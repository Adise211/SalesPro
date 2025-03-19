<template>
  <v-container fluid class="products-page h-100 pa-3" style="max-height: 100%">
    <AppCard>
      <template v-slot:card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="tableItems"
          :page="page"
          :items-per-page="itemsPerPage"
          :search="searchExpression"
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
                  >Add Product</v-btn
                >
              </v-col>
            </v-row>
          </template>

          <!-- table body -->
          <template v-slot:item="{ item, index }">
            <tr>
              <td>{{ index + 1 }}</td>
              <td>{{ item.Name }}</td>
              <td>{{ item.Description }}</td>
              <td>{{ item.UpdatedBy || "" }}</td>
              <td>{{ changedDateFormat(item.LastUpdated) }}</td>
              <td>
                <v-icon @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon color="error" class="ml-2" @click="deleteItem(item)">mdi-delete</v-icon>
              </td>
            </tr>
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

  <!-- Product dialog -->
  <v-dialog v-model="isDialogOpen" id="product-dialog">
    <AppCard :cardContentOnly="false" width="30%" height="85%">
      <template v-slot:card-title>
        <div>Add Product</div>
      </template>
      <template v-slot:card-text>
        <v-form ref="form">
          <v-text-field
            v-model="currentProduct.Name"
            label="Product Name"
            maxLength="25"
            :rules="[formRules.required]"
          ></v-text-field>
          <v-textarea
            v-model="currentProduct.Description"
            label="About The Product"
            maxLength="150"
            counter
          ></v-textarea>
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
import { mapActions, mapState } from "pinia";
import AppCard from "@/components/AppCard.vue";
import { createNewProduct, updateProduct, removeProduct } from "@/firebase/services/workspace";
import { useGeneralStore } from "@/stores/general";
import { ToastMessages } from "@/utilities/consts";
import { convertDate } from "@/utilities/utilsFuncs";

const NEW_PRODUCT_OPBJECT = {
  Name: null,
  Description: null,
  UpdatedBy: null,
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
    ...mapActions(useGeneralStore, [
      "setToastMessage",
      "addItemToListInStore",
      "updateItemFromListInStore",
      "removeItemFromListInStore"
    ]),
    async onSaveItem() {
      let toastType;
      let toastMessage;
      let actionType;
      let response;

      const { valid } = await this.$refs.form.validate();
      if (valid) {
        this.isLoading = true;
        if (!this.isEditMode) {
          response = await createNewProduct(this.currentProduct);
          actionType = "Created";
        } else {
          response = await updateProduct(this.currentProduct);
          actionType = "Updated";
        }

        // Add to store + show success toast message
        if (response.Result.ResultCode > 0) {
          toastType = "success";
          toastMessage = ToastMessages.SuccessMessages[actionType];
          !this.isEditMode
            ? this.addItemToListInStore("productsList", response.Data)
            : this.updateItemFromListInStore("productsList", response.Data);
        } else {
          toastType = "error";
          toastMessage = ToastMessages.ErrorMessages[actionType];
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
    },
    changedDateFormat(date) {
      const fromEpochTime = true;
      return convertDate(date, fromEpochTime).MDYFormat;
    },
    editItem(item) {
      this.isEditMode = true;
      this.isDialogOpen = true;
      this.currentProduct = item;
    },
    async deleteItem(item) {
      let toastType;
      let toastMessage;

      const response = await removeProduct(item);

      if (response.Result.ResultCode > 0) {
        toastType = "success";
        toastMessage = ToastMessages.SuccessMessages.Removed;
        this.removeItemFromListInStore("productsList", item);
      } else {
        toastType = "error";
        toastMessage = ToastMessages.ErrorMessages.Removed;
      }

      this.setToastMessage({
        type: toastType,
        message: toastMessage
      });
    }
  },
  computed: {
    ...mapState(useGeneralStore, ["productsList"]),
    tableHeaders() {
      return [
        {
          title: "Index",
          key: "Index",
          width: "10%"
        },
        {
          title: "Name",
          key: "Name",
          width: "20%"
        },
        {
          title: "Description",
          key: "Description"
        },
        {
          title: "Updated By",
          key: "UpdatedBy",
          width: "15%"
        },
        {
          title: "Last Updated",
          key: "LastUpdated",
          width: "15%"
        },
        {
          title: "Actions",
          key: "",
          width: "10%"
        }
      ];
    },
    tableItems() {
      return this.productsList;
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
