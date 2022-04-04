import _ from "lodash"
import React from "react"

import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"

import { CommonLayout } from "../components"
import { customizationFacade } from "../customization"

const HiddenInput = styled("input")({
  display: "none",
})

interface IFileUploadButtonProps {
  id: string
  accept: string
  multiple?: boolean
  caption: string
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploadButton = ({
  id,
  accept,
  multiple,
  caption,
  onFileChange,
}: IFileUploadButtonProps): React.ReactElement => {
  return (
    <>
      <HiddenInput
        type="file"
        accept={accept}
        multiple={multiple}
        id={id}
        onChange={onFileChange}
      />
      <label htmlFor={id}>
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
          }}
          component="span"
        >
          {caption}
        </Button>
      </label>
    </>
  )
}

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

  const [colorSchemeJsonString, setColorSchemeJsonString] = React.useState(
    JSON.stringify(customizationFacade.settings.colorScheme)
  )

  const handleColorSchemeFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = _.isNil(event.target.files) ? [] : event.target.files
    if (files.length === 0) return
    const text = await files[0].text()
    const obj = JSON.parse(text)
    customizationFacade.settings.colorScheme = obj
    setColorSchemeJsonString(JSON.stringify(obj))
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
          <FormControl>
            <Grid container spacing={1}>
              <Grid item xs={10}>
                <TextField
                  id="color-scheme-input-string"
                  fullWidth
                  value={colorSchemeJsonString}
                  label="Color Scheme"
                  InputProps={{
                    readOnly: true,
                  }}
                  aria-describedby="color-scheme-input-string-helper-text"
                />
              </Grid>
              <Grid item xs={2}>
                <FileUploadButton
                  id="color-scheme-input-upload"
                  accept="application/json"
                  caption="Open..."
                  onFileChange={handleColorSchemeFileChange}
                />
              </Grid>
            </Grid>
            <FormHelperText id="color-scheme-input-string-helper-text">
              Controls the color scheme of Periotris via JSON.
            </FormHelperText>
          </FormControl>
        </Stack>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
