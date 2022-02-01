import React from "react"

import { Stack, Typography } from "@mui/material"

const AboutPage = (): React.ReactElement => {
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

export { AboutPage }
