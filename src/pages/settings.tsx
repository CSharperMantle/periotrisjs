import React from "react"

import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"

import { CommonLayout } from "../components"
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
  const [assistanceGridVisibility, setAssistanceGridVisibility] =
    React.useState(
      customizationFacade.settings.showGridLine ? "visible" : "hidden"
    )

  const handleAssistanceGridVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    customizationFacade.settings.showGridLine = value === "visible"
    setAssistanceGridVisibility(value)
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        flex: "1 1 auto",
        marginTop: 8,
        marginBottom: 8,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <Stack direction="column" spacing={3}>
        <FormControl>
          <TextField
            id="assistance-grid-input"
            select
            value={assistanceGridVisibility}
            label="Assistance grid visibility"
            aria-describedby="assistance-grid-input-helper-text"
            onChange={handleAssistanceGridVisibilityChange}
          >
            {assistanceGridAppearanceOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <FormHelperText id="assistance-grid-input-helper-text">
            Assistance grid is a greyish grid that outlines each available block
            slot.
          </FormHelperText>
        </FormControl>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
