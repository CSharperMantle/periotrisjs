import React from "react"

import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { CommonLayout } from "../components"

const App = (): React.ReactElement => {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{
        flex: "1 1 auto",
      }}
    >
      <Typography variant="h6">Under construction.</Typography>
    </Stack>
  )
}

App.Layout = CommonLayout

export default App
