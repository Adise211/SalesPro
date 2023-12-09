import { createRouter, createWebHistory } from "vue-router";
import ViewPage from "../views/pages/ViewPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home"
    },
    {
      path: "/view-page",
      name: "ViewPage",
      component: ViewPage
    }
  ]
});

export default router;
