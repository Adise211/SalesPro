<template v-if="items.length">
  <template v-for="(item, index) in items" :key="index">
    <v-list-item
      v-if="item.type === navTypes.Link"
      link
      active-class="active-nav-link-style elevation-1"
      :to="item.path"
      density="compact"
      :ripple="false"
      class="nav-item"
    >
      {{ item.title }}
    </v-list-item>
    <v-list-group v-if="item.type === navTypes.Group" :value="item.title">
      <template v-slot:activator="{ props }">
        <v-list-item
          v-bind="props"
          :title="item.title"
          active-class="active-nav-group-style "
          density="compact"
          :ripple="false"
          class="nav-item"
        ></v-list-item>
      </template>
      <template v-for="(child, i) in item.children" :key="i">
        <v-list-item
          link
          active-class="active-nav-link-style elevation-1"
          :to="child.path"
          density="compact"
          :ripple="false"
          class="nav-item"
        >
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
