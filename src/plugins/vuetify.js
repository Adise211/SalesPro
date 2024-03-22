import "vuetify/styles";
import { createVuetify } from "vuetify";
import colors from "vuetify/util/colors";

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
    },
    VCombobox: {
      variant: "outlined",
      density: "comfortable",
      color: "primary"
    },
    VDataTable: {
      VIcon: {
        color: "#0000008a"
      }
    },
    VPagination: {
      activeColor: "primary"
    }
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.blue.darken1
        }
      }
    }
  }
});

export default vuetify;
