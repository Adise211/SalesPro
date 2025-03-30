<template v-if="items.length">
  <template v-for="(item, index) in items" :key="index">
    <v-list-item
      v-if="item.type === navTypes.Link"
      link
      active-class="active-nav-style"
      :to="item.path"
    >
      {{ item.title }}
    </v-list-item>
    <v-list-group v-if="item.type === navTypes.Group" :value="item.title">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :title="item.title"></v-list-item>
      </template>
      <template v-for="(child, i) in item.children" :key="i">
        <v-list-item link active-class="active-nav-style" :to="child.path">
          {{ child.title }}
        </v-list-item>
      </template>
    </v-list-group>
  </template>
</template>

<script>
export default {
  components: {},
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    navTypes: {
      Link: "link",
      Group: "group"
    }
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped></style>
