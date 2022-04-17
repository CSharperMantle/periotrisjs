import validateColorScheme from "ajv-json-loader!../json/schema/ColorScheme.json.schema"
import validateMap from "ajv-json-loader!../json/schema/Map.json.schema"
import _ from "lodash"
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
    if (_.isNaN(value)) {
      enqueueSnackbar("Invalid falling speed value.", { variant: "error" })
      return false
    }
    customizationFacade.settings.gameUpdateIntervalMilliseconds = value
    return true
  }

  const handleBorderThicknessChange = (newContent: string): boolean => {
    const value = parseInt(`0${newContent}`, 10)
    if (_.isNaN(value) || value <= 0) {
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
