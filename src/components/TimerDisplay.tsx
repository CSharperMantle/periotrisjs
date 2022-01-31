import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Box, Typography } from "@mui/material"

import { PeriotrisViewModelContext } from "../viewmodel"

const TimerDisplay = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)

  const elapsedTime = viewModel.elapsedTime
  const fastestRecord = viewModel.fastestRecord

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
        sx={{
          margin: "0 auto",

          textAlign: "center",
          fontSize: "3vh",
          color: "white",
        }}
      >
        {fastestRecord.format("mm:ss")}
      </Typography>
      <Typography
        sx={{
          margin: "0 auto",

          textAlign: "center",
          fontSize: "3vh",
          color: "yellow",
        }}
      >
        {elapsedTime.format("mm:ss")}
      </Typography>
    </Box>
  )
})

export { TimerDisplay }
