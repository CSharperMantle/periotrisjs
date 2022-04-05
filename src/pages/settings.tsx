import Ajv from "ajv"
import _ from "lodash"
import { useSnackbar } from "notistack"
import React from "react"

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

import type { IColorScheme, IMap } from "../customization"
import { InputAdornment } from "@mui/material"

const ajv = new Ajv()

const validateColorScheme = ajv.compile<IColorScheme>(colorSchemeSchema)
const validateMap = ajv.compile<IMap>(mapSchema)

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

  const [fallingSpeed, setFallingSpeed] = React.useState(
    customizationFacade.settings.gameUpdateIntervalMilliseconds.toString()
  )

  const handleFallingSpeedChange = (newContent: string): boolean => {
    const value = parseInt(newContent, 10)
    if (_.isNaN(value)) {
      enqueueSnackbar("Invalid falling speed value.", { variant: "error" })
      return false
    }
    customizationFacade.settings.gameUpdateIntervalMilliseconds = value
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
          <FormControl>
            <TextField
              id="falling-speed-input"
              value={fallingSpeed}
              label="Tetrimino Falling Speed"
              type="number"
              aria-describedby={`falling-speed-input-helper-text`}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">ms</InputAdornment>
                ),
              }}
              onChange={(event) => {
                const content = event.target.value
                if (handleFallingSpeedChange(content)) {
                  setFallingSpeed(content)
                }
              }}
            />
            <FormHelperText id={`falling-speed-input-helper-text`}>
              Controls the speed of falling tetriminos in milliseconds.
            </FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
