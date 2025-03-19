<template>
  <v-container fluid class="teams-page h-100 pa-3" style="max-height: 100%">
    <AppCard>
      <template v-slot:card-text>
        <v-data-table> </v-data-table>
      </template>
    </AppCard>
  </v-container>
</template>

<script>
import AppCard from "@/components/AppCard.vue";

export default {
  name: "TeamsPage",
  components: { AppCard },
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
