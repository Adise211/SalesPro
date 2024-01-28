import { createRouter, createWebHistory } from "vue-router";
import { initStores } from "../stores";

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
      path: "/signup",
      name: "SignupPage",
      component: () => import("../views/pages/SignupPage.vue"),
      meta: { layout: "MinimalLayout" }
    },
    {
      path: "/view-page",
      name: "ViewPage",
      component: () => import("../views/pages/ViewPage.vue"),
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/calendar-page/:calendarMode",
      // calendarStatus: "edit" || "view"
      name: "CalendarPage",
      component: () => import("../views/pages/CalendarPage.vue"),
      props: (route) => {
        return {
          ...route.params,
          calendarMode: route.params.calendarMode
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/tracking/:trackingLabel",
      // trackingLabel: "followups" || "leads" || "closed"
      name: "TrackingPage",
      component: () => import("../views/pages/TrackingPage.vue"),
      props: (route) => {
        return {
          ...route.params,
          trackingLabel: route.params.trackingLabel
        };
      },
      meta: { layout: "DefaultLayout" }
    }
  ]
});

router.beforeEach(async (to) => {
  let navigationGuardResult;
  let isUserAuthorized;

  const { generalStore } = initStores();
  if (generalStore.userId) {
    isUserAuthorized = true;
  } else {
    isUserAuthorized = false;
  }

  if (isUserAuthorized || to.name === "LoginPage") {
    navigationGuardResult = true;
  } else {
    navigationGuardResult = {
      name: "LoginPage"
    };
  }

  return navigationGuardResult;
});

export default router;
