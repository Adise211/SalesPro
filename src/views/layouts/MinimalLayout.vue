<template>
  <div class="minimal-layout">
    <v-layout class="rounded rounded-md">
      <v-main class="main-content">
        <slot></slot>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "MinimalLayout",
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

<style scoped></style>
