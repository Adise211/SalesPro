import { createApp } from "vue";
import { _loadSettings } from "./utilities/config";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import pinia from "./plugins/pinia";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
import "./styles/global.scss";

const app = createApp(App);

init();

async function init() {
  await _loadSettings();

  app.use(pinia);
  app.use(router);
  app.use(vuetify);
  app.use(ToastPlugin);
  app.mount("#app");
}
