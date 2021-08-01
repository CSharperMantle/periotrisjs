import { createTheme, Theme, ThemeOptions } from "@material-ui/core/styles"

const themeOptions: ThemeOptions = {
  palette: {
    type: "dark",
    primary: {
      main: "#7a84e8",
    },
    secondary: {
      main: "#f44334",
    },
  },
}

const theme: Theme = createTheme(themeOptions)

export { themeOptions, theme }
