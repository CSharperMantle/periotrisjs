import { createTheme, Theme, ThemeOptions } from "@mui/material/styles"

export const themeOptions: ThemeOptions = {
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

export const theme: Theme = createTheme(themeOptions)
