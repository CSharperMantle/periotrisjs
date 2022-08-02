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

import validateColorScheme from "ajv-json-loader!../json/schema/ColorScheme.json.schema"
import validateMap from "ajv-json-loader!../json/schema/Map.json.schema"
import { useSnackbar } from "notistack"
import React from "react"

import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import InputAdornment from "@mui/material/InputAdornment"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { CommonLayout, FileFormControl, NumberFormControl } from "../components"
import { customizationFacade } from "../customization"

const assistanceGridAppearanceOptions = [
  {
    value: "visible",
    label: "Visible",
  },
  {
    value: "hidden",
    label: "Hidden",
  },
]

const App = (): React.ReactElement => {
  const { enqueueSnackbar } = useSnackbar()

  const [assistanceGridMode, setAssistanceGridMode] = React.useState(
    customizationFacade.settings.showGridLine ? "visible" : "hidden"
  )

  const handleAssistanceGridModeChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    customizationFacade.settings.showGridLine = value === "visible"
    setAssistanceGridMode(value)
  }

  const jsonMinifyPreprocessor = (json: string): string => {
    return JSON.stringify(JSON.parse(json))
  }

  const handleColorSchemeFileChange = (newContent: string): boolean => {
    const obj = JSON.parse(newContent)
    if (validateColorScheme(obj)) {
      customizationFacade.settings.colorScheme = obj
      return true
    }
    enqueueSnackbar(
      "Invalid color scheme file. Please check your file format.",
      { variant: "error" }
    )
    return false
  }

  const handleGameMapFileChange = (newContent: string): boolean => {
    const obj = JSON.parse(newContent)
    if (validateMap(obj)) {
      customizationFacade.settings.gameMap = obj
      return true
    }
    enqueueSnackbar("Invalid game map file. Please check your file format.", {
      variant: "error",
    })
    return false
  }

  const handleUpdateIntervalChange = (newContent: string): boolean => {
    const value = parseInt(`0${newContent}`, 10)
    if (isNaN(value)) {
      enqueueSnackbar("Invalid falling speed value.", { variant: "error" })
      return false
    }
    customizationFacade.settings.gameUpdateIntervalMilliseconds = value
    return true
  }

  const handleBorderThicknessChange = (newContent: string): boolean => {
    const value = parseInt(`0${newContent}`, 10)
    if (isNaN(value) || value <= 0) {
      enqueueSnackbar("Invalid border thickness value.", { variant: "error" })
      return false
    }
    customizationFacade.settings.borderThickness = value
    return true
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flex: "1 1 auto",
        ml: "auto",
        mr: "auto",
        pt: 4,
        pb: 4,
      }}
    >
      <Stack direction="column" spacing={5}>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            Appearance
          </Typography>
          <FormControl>
            <TextField
              id="assistance-grid-input"
              select
              value={assistanceGridMode}
              label="Assistance Grid"
              aria-describedby="assistance-grid-input-helper-text"
              onChange={handleAssistanceGridModeChange}
            >
              {assistanceGridAppearanceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <FormHelperText id="assistance-grid-input-helper-text">
              Controls the assistance grid which outlines each grid square to
              help you better position falling blocks.
            </FormHelperText>
          </FormControl>
          <NumberFormControl
            id="border-thickness-input"
            label="Border Thickness"
            initialContent={customizationFacade.settings.borderThickness.toString()}
            helperText="Controls thickness of borders around cells in pixels."
            min={0}
            step={1}
            adornments={{
              endAdornment: <InputAdornment position="end">px</InputAdornment>,
            }}
            onChange={handleBorderThicknessChange}
          />
          <FileFormControl
            id="color-scheme-input"
            readOnly
            initialFileContent={JSON.stringify(
              customizationFacade.settings.colorScheme
            )}
            accept="application/json"
            label="Color Scheme"
            helperText="Controls the color scheme of Periotris via JSON."
            buttonCaption="OPEN"
            onFileChange={handleColorSchemeFileChange}
            contentPreprocessor={jsonMinifyPreprocessor}
          />
        </Stack>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            Gameplay
          </Typography>
          <FileFormControl
            id="game-map-input"
            readOnly
            initialFileContent={JSON.stringify(
              customizationFacade.settings.gameMap
            )}
            accept="application/json"
            label="Game Map"
            helperText="Controls the periodic table map to play with in the game via JSON."
            buttonCaption="OPEN"
            onFileChange={handleGameMapFileChange}
            contentPreprocessor={jsonMinifyPreprocessor}
          />
          <NumberFormControl
            id="update-interval-input"
            label="Update Interval"
            initialContent={customizationFacade.settings.gameUpdateIntervalMilliseconds.toString()}
            min={0}
            step={100}
            helperText="Controls the interval of two ticks in game in milliseconds."
            adornments={{
              endAdornment: <InputAdornment position="end">ms</InputAdornment>,
            }}
            onChange={handleUpdateIntervalChange}
          />
        </Stack>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
