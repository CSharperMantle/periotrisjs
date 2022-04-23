import _ from "lodash"
import { observer } from "mobx-react"
import React, { useContext } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { GameViewModelContext } from "../../viewmodel"

export const TimerDisplay = observer((): React.ReactElement => {
  const viewModel = useContext(GameViewModelContext)

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
        {_.isNil(fastestRecord) ? "--:--" : fastestRecord.format("mm:ss")}
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
