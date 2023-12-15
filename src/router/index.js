import { createRouter, createWebHistory } from "vue-router";

/**
 *
 * meta.layout --> type of layout ("DefaultLayout" or "MinimalLayout")
 *
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      redirect: () => {
        return { name: "LoginPage" };
      },
      meta: { layout: "MinimalLayout" }
    },
    {
      path: "/login",
      name: "LoginPage",
      component: () => import("../views/pages/LoginPage.vue"),
      meta: { layout: "MinimalLayout" }
    },
    {
      path: "/view-page",
      name: "ViewPage",
      component: () => import("../views/pages/ViewPage.vue"),
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/calendar-page",
      name: "CalendarPage",
      component: () => import("../views/pages/CalendarPage.vue"),
      meta: { layout: "DefaultLayout" }
    }
  ]
});

export default router;
