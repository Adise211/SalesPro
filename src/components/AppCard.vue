<template>
  <v-card elevation="3" :max-width="cardMaxWidth" max-height="100%" :height="cardHeight">
    <!-- Card Title -->
    <v-card-title v-if="!cardContentOnly">
      <slot name="card-title"></slot>
    </v-card-title>
    <!-- Card Subtitle -->
    <v-card-subtitle v-if="!cardContentOnly">
      <slot name="card-sub-title"></slot>
    </v-card-subtitle>
    <!-- Card Text (content) -->
    <v-card-text :class="cardTextClass">
      <slot name="card-text"></slot>
    </v-card-text>
    <!-- Card Actions (buttons) -->
    <v-card-actions v-if="!cardContentOnly" class="pb-0">
      <slot name="card-actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  components: {},
  props: {
    cardMaxWidth: {
      type: [Number, String],
      default: "100%"
    },
    cardContentOnly: {
      type: Boolean,
      default: true
    },
    cardHeight: {
      type: [Number, String],
      default: "100%"
    },
    cardTextClass: {
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

<style scoped></style>
