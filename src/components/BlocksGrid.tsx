import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Box } from "@mui/material"

import { PlayAreaHeight, PlayAreaWidth } from "../common"
import { PeriotrisViewModelContext } from "../viewmodel"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import { BlockControl } from "./BlockControl"
import { TimerDisplay } from "./TimerDisplay"

const BlocksGrid = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)

  const paddedBlocks: IDisplayBlock[][] = []

  for (let i = 0; i < PlayAreaHeight; i++) {
    paddedBlocks[i] = []
    for (let j = 0; j < PlayAreaWidth; j++) {
      paddedBlocks[i][j] = {
        withContent: false,
        atomicNumber: 0,
        row: i,
        column: j,
        symbolColor: "black",
      }
    }
  }
  const sprites = viewModel.sprites
  sprites.forEach((block: IDisplayBlock) => {
    paddedBlocks[block.row][block.column] = block
  })
  const flattened = paddedBlocks.flat()

  const blocks = flattened.map((block: IDisplayBlock, index: number) => {
    return (
      <BlockControl
        key={index}
        withContent={block.withContent}
        atomicNumber={block.atomicNumber}
        row={block.row}
        column={block.column}
        symbolColor={block.symbolColor}
      />
    )
  })

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
