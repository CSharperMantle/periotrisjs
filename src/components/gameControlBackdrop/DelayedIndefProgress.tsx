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

import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Fade from "@mui/material/Fade"

interface IDelayedIndefProgressProps {
  readonly delayMs: number
}

export const DelayedIndefProgress = (props: IDelayedIndefProgressProps) => {
  return (
    <Box>
      <Fade
        in
        style={{
          transitionDelay: `${props.delayMs}ms`,
        }}
        unmountOnExit
      >
        <CircularProgress size={50} variant="indeterminate" />
      </Fade>
    </Box>
  )
}
