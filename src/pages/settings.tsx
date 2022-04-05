import React from "react"

import Ajv from "ajv"

import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { CommonLayout, FileFormControl } from "../components"
import { customizationFacade } from "../customization"

import colorSchemeSchema from "../json/schema/ColorScheme.schema.json"
import mapSchema from "../json/schema/Map.schema.json"

const ajv = new Ajv()

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
  // TODO: Prettify this component and make it more readable!

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
    if (ajv.validate(colorSchemeSchema, obj)) {
      customizationFacade.settings.colorScheme = obj
      return true
    }
    return false
  }

  const handleGameMapFileChange = (newContent: string): boolean => {
    const obj = JSON.parse(newContent)
    if (ajv.validate(mapSchema, obj)) {
      customizationFacade.settings.gameMap = obj
      return true
    }
    return false
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
          <FileFormControl
            id="color-scheme-input"
            readOnly
            initialFileContent={JSON.stringify(
              customizationFacade.settings.colorScheme
            )}
            accept="application/json"
            label="Color Scheme"
            helperText="Controls the color scheme of Periotris via JSON."
            buttonCaption="BROWSE"
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
            buttonCaption="BROWSE"
            onFileChange={handleGameMapFileChange}
            contentPreprocessor={jsonMinifyPreprocessor}
          />
        </Stack>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
