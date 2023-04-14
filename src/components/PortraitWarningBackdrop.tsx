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

import React from "react"

import Backdrop from "@mui/material/Backdrop"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import useMediaQuery from "@mui/material/useMediaQuery"

export const PortraitWarningBackdrop = (): React.ReactElement => {
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
