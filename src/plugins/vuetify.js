import "vuetify/styles";
import { createVuetify } from "vuetify";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi"
  },
  defaults: {
    VTextField: {
      variant: "outlined",
      density: "comfortable"
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable"
    },
    VTextarea: {
      variant: "outlined"
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable"
    }
  }
});

export default vuetify;
