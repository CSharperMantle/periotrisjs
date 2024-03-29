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
import Typography from "@mui/material/Typography"

import { formatDuration } from "../../common"
import { useAppSelector } from "../../viewmodel"

export const TimerDisplay = () => {
  const elapsedTime = useAppSelector(
    (state) => state.game.timerDisplay.elapsedTime
  )
  const fastestRecord = useAppSelector(
    (state) => state.game.timerDisplay.fastestRecord
  )

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        justifyItems: "center",

        position: "absolute",
        right: "0",
        top: "0",
        width: "10%",
        height: "10%",
        zIndex: "speedDial",
        margin: "3px",
      }}
    >
      <Typography
        align="center"
        sx={{
          margin: "0 auto",

          fontSize: "3vh",
          color: "white",
        }}
      >
        {formatDuration(fastestRecord)}
      </Typography>
      <Typography
        align="center"
        sx={{
          margin: "0 auto",

          fontSize: "3vh",
          color: "yellow",
        }}
      >
        {formatDuration(elapsedTime)}
      </Typography>
    </Box>
  )
}
