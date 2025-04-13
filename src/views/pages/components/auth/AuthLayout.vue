<template>
  <v-container fluid class="pa-0 fill-height d-flex justify-center">
    <v-row>
      <v-col class="d-flex justify-center" cols="12">
        <v-card width="30%" elevation="3" class="my-6">
          <slot />
        </v-card>
      </v-col>
      <div class="position-absolute tree-2">
        <v-img :src="treeImg2" :width="350" />
      </div>
      <div class="position-absolute tree-1">
        <v-img :src="treeImg1" :width="250" />
      </div>
    </v-row>
  </v-container>
</template>

<script>
import authV1Tree2 from "@/assets/images/auth-v1-tree-2.png";
import authV1Tree from "@/assets/images/auth-v1-tree.png";

export default {
  components: {},
  props: {},
  data: () => ({
    treeImg1: authV1Tree,
    treeImg2: authV1Tree2
  }),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>
.tree-1 {
  left: 50px;
  bottom: 50px;
}

.tree-2 {
  right: 100px;
  bottom: 70px;
}
</style>
