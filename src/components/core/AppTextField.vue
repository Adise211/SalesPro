<template>
  <v-text-field
    hide-details
    single-line
    density="compact"
    variant="outlined"
    flat
    placeholder="Search"
    prepend-inner-icon="mdi-magnify"
    class="search-input inline-size"
  ></v-text-field>
</template>

<script>
export default {
  components: {},
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>
.inline-size {
  max-inline-size: 280px;
  min-inline-size: 200px;
}
</style>
