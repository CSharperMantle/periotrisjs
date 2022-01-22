import { createTheme, Theme, ThemeOptions } from "@mui/material/styles"

const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
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
