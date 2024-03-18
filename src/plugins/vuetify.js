import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi"
  },
  defaults: {
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary"
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary"
    },
    VTextarea: {
      variant: "outlined",
      color: "primary"
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary"
    }
  }
});

export default vuetify;
