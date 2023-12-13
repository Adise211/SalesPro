import { createRouter, createWebHistory } from "vue-router";

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
      component: () => import("../views/pages/ViewPage.vue")
    },
    {
      path: "/calendar-page",
      name: "CalendarPage",
      component: () => import("../views/pages/CalendarPage.vue")
    }
  ]
});

export default router;
