import { createRouter, createWebHistory } from "vue-router";
import ViewPage from "../views/pages/ViewPage.vue";
import CalendarPage from "../views/pages/CalendarPage.vue";

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
    },
    {
      path: "/calendar-page",
      name: "CalendarPage",
      component: CalendarPage
    }
  ]
});

export default router;
