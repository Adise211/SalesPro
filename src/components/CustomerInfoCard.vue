<template>
  <AppCard>
    <template v-slot:card-text>
      <div class="text-end">
        <v-icon @click="onCloseDialog">mdi-close</v-icon>
      </div>
      <div class="d-flex flex-column justify-center align-center">
        <v-avatar size="100" color="primary">
          <v-icon icon="mdi-domain" size="60"></v-icon>
        </v-avatar>
        <span class="mt-2 mb-5 text-h6">{{ selectedItem.Company }}</span>
        <v-list>
          <v-list-item prepend-icon="mdi-account-box-outline">
            {{ selectedItem.ContactPerson.Name }} - {{ selectedItem.ContactPerson.Role }}
          </v-list-item>
          <v-list-item prepend-icon="mdi-email-outline">
            {{ selectedItem.Email }}
          </v-list-item>
          <v-list-item prepend-icon="mdi-phone-outline">
            {{ selectedItem.Phone }}
          </v-list-item>
          <v-list-item prepend-icon="mdi-web">
            {{ selectedItem.Website }}
          </v-list-item>
          <v-list-item prepend-icon="mdi-map-marker-outline">
            {{ selectedItem.Location }}
          </v-list-item>
        </v-list>
      </div>
    </template>
  </AppCard>
</template>

<script>
import AppCard from "./AppCard.vue";

export default {
  components: { AppCard },
  props: {
    selectedItem: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {
    onCloseDialog() {
      this.$emit("onCloseContactDialog");
    }
  },
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
