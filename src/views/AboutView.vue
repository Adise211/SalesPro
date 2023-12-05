<template>
  <div class="about">New Component</div>
</template>

<script>
import { db } from "@/firebase/connection";
import { collection, getDocs } from "firebase/firestore";
export default {
  name: "AboutPage",
  components: {},
  props: {},
  data: () => ({}),
  created() {},
  async mounted() {
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
