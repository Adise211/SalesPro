<template>
  <div
    v-if="settingType === 'ProfilePicture'"
    class="d-flex flex-column align-center fill-height justify-center"
  >
    <div class="text-h5 mb-2">Upload Profile Picture</div>
    <div class="mb-7">Drop file or click inside the circle</div>
    <v-file-input class="d-none" ref="fileInput" accept="image/*" :multiple="false"> </v-file-input>
    <div class="drag-drop-container d-flex flex-column justify-center align-center">
      <v-icon icon="mdi-image" color="grey"></v-icon>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    settingType: {
      type: String,
      default: ""
    }
  },
  data: () => ({}),
  created() {},
  mounted() {},
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>
.drag-drop-container {
  border: 2px #bdbdbd dashed;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
