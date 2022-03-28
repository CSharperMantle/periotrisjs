import _ from "lodash"
import { observer } from "mobx-react"
import React, { useContext } from "react"

import Box from "@mui/material/Box"

import { GameViewModelContext } from "../viewmodel"
import { BlockControl } from "./BlockControl"
import { TimerDisplay } from "./TimerDisplay"
import { customizationFacade } from "../customization"

import type { IBlockDisplay } from "./IBlockDisplay"

const BlocksGrid = observer((): React.ReactElement => {
  const viewModel = useContext(GameViewModelContext)

  const playAreaSize = customizationFacade.settings.gameMap.playAreaSize
  const showGridLine = customizationFacade.settings.showGridLine

  const paddedBlocks: IBlockDisplay[][] = []

  for (let i = 0; i < playAreaSize.height; i++) {
    paddedBlocks[i] = []
    for (let j = 0; j < playAreaSize.width; j++) {
      paddedBlocks[i][j] = {
        hasContent: false,
        hasBorder: showGridLine,
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
    paddedBlocks[block.row][block.column] = {
      ...block,
      hasContent: true,
      hasBorder: showGridLine,
      symbolColor: "black",
    }
  }

  const blocks = _.map(_.flatten(paddedBlocks), (block: IBlockDisplay) => {
    return <BlockControl block={block} />
  })

  return (
    <Box
      sx={{
        margin: "0 auto",

        position: "relative",
        height: "100%",
        aspectRatio: `auto ${playAreaSize.width} / ${playAreaSize.height}`,

        backgroundColor: "black",
      }}
    >
      <TimerDisplay />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${playAreaSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${playAreaSize.height}, 1fr)`,

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
