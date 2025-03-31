import "vuetify/styles";
import { createVuetify } from "vuetify";
// import colors from "vuetify/util/colors";

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi"
  },
  defaults: {
    VTextField: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      validateOn: "submit"
    },
    VSelect: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      validateOn: "submit"
    },
    VTextarea: {
      variant: "outlined",
      color: "primary",
      validateOn: "submit"
    },
    VAutocomplete: {
      variant: "outlined",
      density: "comfortable",
      color: "primary",
      validateOn: "submit"
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
          primary: "rgb(140, 87, 255)",
          "primary-darken-1": "rgb(126, 78, 230)",
          background: "rgb(244, 245, 250)"
        }
      }
    }
  }
});

export default vuetify;
