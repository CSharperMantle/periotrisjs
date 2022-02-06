import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Box } from "@mui/material"

import { PlayAreaHeight, PlayAreaWidth } from "../common"
import { PeriotrisViewModelContext } from "../viewmodel"
import { BlockControl } from "./BlockControl"
import { TimerDisplay } from "./TimerDisplay"

import type { IDisplayBlock } from "../viewmodel"
import _ from "lodash"

const BlocksGrid = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)

  const paddedBlocks: IDisplayBlock[][] = []

  for (let i = 0; i < PlayAreaHeight; i++) {
    paddedBlocks[i] = []
    for (let j = 0; j < PlayAreaWidth; j++) {
      paddedBlocks[i][j] = {
        withContent: false,
        withBorder: viewModel.showGridLine,
        atomicNumber: 0,
        row: i,
        column: j,
        symbolColor: "black",
      }
    }
  }
  const sprites = viewModel.sprites
  for (let i = 0, len = sprites.length; i < len; i++) {
    const block = sprites[i]
    paddedBlocks[block.row][block.column] = block
  }

  const blocks = _.map(
    _.flatten(paddedBlocks),
    (block: IDisplayBlock, index: number) => {
      return <BlockControl key={index} {...block} />
    }
  )

  return (
    <Box
      sx={{
        margin: "0 auto",

        position: "relative",
        height: "100%",
        aspectRatio: "auto 18 / 11",

        backgroundColor: "black",
      }}
    >
      <TimerDisplay />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(18, 1fr)",
          gridTemplateRows: "repeat(11, 1fr)",

          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        {blocks}
      </Box>
    </Box>
  )
})

export { BlocksGrid }
