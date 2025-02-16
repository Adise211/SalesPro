import { createRouter, createWebHistory } from "vue-router";
import { initStores } from "../stores";
import HomePage from "../views/pages/HomePage.vue";
import LoginPage from "../views/pages/LoginPage.vue";
import SignupPage from "../views/pages/SignupPage.vue";
import CalendarPage from "../views/pages/CalendarPage.vue";
import SalesPage from "../views/pages/SalesPage.vue";
import NotesPage from "../views/pages/NotesPage.vue";
import ProductsPage from "../views/pages/ProductsPage.vue";
import FilesPage from "../views/pages/FilesPage.vue";
import MyAccountPage from "../views/pages/MyAccountPage.vue";
import ErrorMessagesPage from "../views/pages/ErrorMessagesPage.vue";

/**
 *
 * meta.layout --> type of layout ("DefaultLayout" or "MinimalLayout")
 * No need for lazy load (small project + lazy loads creates a bug)
 *
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "HomePage",
      component: HomePage,
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage,
      meta: { layout: "MinimalLayout" }
    },
    {
      path: "/signup",
      name: "SignupPage",
      component: SignupPage,
      meta: { layout: "MinimalLayout" }
    },
    {
      path: "/calendar",
      name: "CalendarPage",
      component: CalendarPage,
      props: (route) => {
        return {
          ...route.params
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/sales/:stageName",
      // stageName: "followups" || "leads" || "closed"
      name: "SalesPage",
      component: SalesPage,
      props: (route) => {
        return {
          ...route.params,
          stageName: route.params.stageName
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/notes/:noteId?",
      name: "NotesPage",
      component: NotesPage,
      props: (route) => {
        return {
          ...route.params
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/products",
      name: "ProductsPage",
      component: ProductsPage,
      props: (route) => {
        return {
          ...route.params
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/files",
      name: "FilesPage",
      component: FilesPage,
      props: (route) => {
        return {
          ...route.params
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/account",
      name: "MyAccountPage",
      component: MyAccountPage,
      props: (route) => {
        return {
          ...route.params
        };
      },
      meta: { layout: "DefaultLayout" }
    },
    {
      path: "/error-message/:messageId",
      name: "ErrorMessagesPage",
      component: ErrorMessagesPage,
      props: (route) => {
        return {
          ...route.params,
          messageId: Number.parseInt(route.params.messageId) || 0
        };
      },
      meta: { layout: "MinimalLayout" }
    }
  ]
});

router.beforeEach(async (to) => {
  let navigationGuardResult;
  let isUserAuthorized;
  const isRouteExist = router.hasRoute(to.name);

  const { generalStore } = initStores();
  if (generalStore.userId) {
    isUserAuthorized = true;
  } else {
    isUserAuthorized = false;
  }

  if (
    (isUserAuthorized && isRouteExist) ||
    to.name === "LoginPage" ||
    to.name === "SignupPage" ||
    to.name === "ErrorMessagesPage"
  ) {
    navigationGuardResult = true;
  } else if (!isRouteExist) {
    navigationGuardResult = {
      name: "ErrorMessagesPage",
      params: {
        messageId: 0
      }
    };
  } else {
    navigationGuardResult = {
      name: "LoginPage"
    };
  }

  return navigationGuardResult;
});

export default router;
