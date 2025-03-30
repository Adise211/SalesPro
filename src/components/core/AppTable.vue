<template>
  <v-data-table-virtual
    :headers="headers"
    :items="items"
    :item-value="itemValue"
    :show-select="showSelect"
    :search="search"
    fixed-header
    hover
  >
  </v-data-table-virtual>
</template>

<script>
export default {
  components: {},
  props: {
    headers: Array,
    items: Array,
    itemValue: String,
    search: String,
    showSelect: Boolean
  },
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
