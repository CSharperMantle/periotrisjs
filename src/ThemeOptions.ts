import {
  adaptV4Theme,
  createTheme,
  DeprecatedThemeOptions,
  Theme,
} from "@mui/material/styles"

const themeOptions: DeprecatedThemeOptions = {
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

const theme: Theme = createTheme(adaptV4Theme(themeOptions))

export { themeOptions, theme }
