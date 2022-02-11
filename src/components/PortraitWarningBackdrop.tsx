import React from "react"

import { Backdrop, Grid, Typography, useMediaQuery } from "@mui/material"

const PortraitWarningBackdrop = (): React.ReactElement => {
  const isPortrait = useMediaQuery("(orientation: portrait)")

  return (
    <Backdrop
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: "modal",
      }}
      open={isPortrait}
    >
      <Grid
        container
        sx={{
          height: "100%",
        }}
        direction="column"
        alignItems="center"
        justifyContent="space-evenly"
        spacing={1}
      >
        <Typography sx={{ textAlign: "center" }} variant="h2">
          Landscape.
        </Typography>
        <Typography sx={{ textAlign: "center" }} variant="body1">
          You are now in portrait mode.
          <br />
          Please switch to landscape mode.
        </Typography>
      </Grid>
    </Backdrop>
  )
}

export { PortraitWarningBackdrop }
