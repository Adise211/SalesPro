<template>
  <v-navigation-drawer color="background" persistent width="250" floating>
    <div class="w-100 d-flex flex-row my-5 align-center justify-center text-h5">
      <v-icon color="primary">mdi-lighthouse-on</v-icon>
      <div>LightSale</div>
    </div>
    <v-list>
      <NavItems :items="navItemsList" />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import NavItems from "./NavItems.vue";

const NAV_ITEMS = {
  Link: "link",
  Group: "group"
};

export default {
  components: { NavItems },
  props: {},
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {
    navItemsList() {
      return [
        {
          type: NAV_ITEMS.Link,
          title: "Home",
          icon: "",
          path: { name: "HomePage" },
          children: []
        },
        {
          type: NAV_ITEMS.Group,
          title: "Leads",
          icon: "",
          path: { name: "HomePage" },
          children: [
            {
              type: NAV_ITEMS.Link,
              title: "View",
              icon: "",
              path: { name: "SalesPage" }
            },
            {
              type: NAV_ITEMS.Link,
              title: "List",
              icon: "",
              path: { name: "ProductsPage" }
            }
          ]
        }
      ];
    }
  },
  watch: {}
};
</script>

<style scoped></style>
