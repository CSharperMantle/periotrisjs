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

import { customizationFacade } from "../../customization"
import { useAppSelector } from "../../viewmodel"
import { TimerDisplay } from "../timerDisplay/TimerDisplay"
import { BlockControl } from "./BlockControl"

import type { IBlockDisplay } from "./IBlockDisplay"

/**
 * Get hash code string for a display block.
 *
 * @param blockDisplay The display block to hash.
 * @returns The hashed string of block.
 */
function getIBlockDisplayHash(blockDisplay: IBlockDisplay): string {
  return `${blockDisplay.column}:${blockDisplay.row}-${blockDisplay.atomicNumber}`
}

/**
 * Represents the main play area grid.
 */
export const BlocksGrid = () => {
  const playAreaSize = customizationFacade.settings.gameMap.playAreaSize
  const showGridLine = customizationFacade.settings.showGridLine

  const paddedBlocks: IBlockDisplay[][] = new Array(playAreaSize.height)
  for (let i = 0; i < playAreaSize.height; i++) {
    const row = new Array(playAreaSize.width)
    for (let j = 0; j < playAreaSize.width; j++) {
      row[j] = {
        hasContent: false,
        hasBorder: showGridLine,
        atomicNumber: 0,
        row: i,
        column: j,
        symbolColor: "black",
      }
    }
    paddedBlocks[i] = row
  }

  const sprites = useAppSelector((state) => {
    return state.game.blocksGrid.sprites
  })

  for (let i = 0, len = sprites.length; i < len; i++) {
    const block = sprites[i]
    paddedBlocks[block.row][block.column] = {
      ...block,
      hasContent: true,
      hasBorder: true,
      symbolColor: "black",
    }
  }

  const blocks = paddedBlocks
    .flat()
    .map((block) => (
      <BlockControl block={block} key={getIBlockDisplayHash(block)} />
    ))

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
}
