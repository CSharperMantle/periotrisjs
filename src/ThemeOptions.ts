/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { createTheme } from "@mui/material/styles"

import type { ThemeOptions } from "@mui/material/styles"

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      light: "#cacbff",
      main: "#5a67ff",
      dark: "#323fef",
    },
    secondary: {
      light: "#fbb9df",
      main: "#ff009d",
      dark: "#f10082",
    },
  },
  typography: {
    fontFamily: [
      "'Roboto Flex Variable'",
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      "'Helvetica Neue'",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
}

export const theme = createTheme(themeOptions)
