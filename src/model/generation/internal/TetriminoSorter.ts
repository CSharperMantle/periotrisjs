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

import { flatten, map, uniq } from "lodash"
import toposort from "toposort"

import { isNil, rearrange } from "../../../common"
import { Tetrimino } from "../../Tetrimino"

import type { ISize } from "../../../common"

function getEdges(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): [number, number][] {
  // Create owners map
  const owners: number[][] = new Array(playAreaSize.height)
  for (let i = 0; i < playAreaSize.height; i++) {
    owners[i] = new Array(playAreaSize.width)
  }
  // Fill in owners map
  for (let i = 0; i < tetriminos.length; i++) {
    const tetrimino = tetriminos[i]
    for (let j = 0; j < tetrimino.blocks.length; j++) {
      const block = tetrimino.blocks[j]
      owners[block.position[1]][block.position[0]] = i
    }
  }

  return uniq(
    flatten(
      map(tetriminos, (tetrimino, index) => {
        const singleTetriminoDeps: [number, number][] = []
        for (let i = 0; i < tetrimino.blocks.length; i++) {
          const block = tetrimino.blocks[i]
          const dependedBlockRow = block.position[1] + 1
          const dependedBlockCol = block.position[0]
          const result = tryGetOccupiedTetriminoNode(
            owners,
            dependedBlockRow,
            dependedBlockCol,
            playAreaSize
          )
          if (isNil(result) || result === index) {
            // Ignore self-dependency
            continue
          }
          // Found a result
          singleTetriminoDeps.push([result, index])
        }
        return singleTetriminoDeps
      })
    )
  )
}

function tryGetOccupiedTetriminoNode(
  map: number[][],
  row: number,
  col: number,
  playAreaSize: ISize
): number | null {
  if (
    row < 0 ||
    row >= playAreaSize.height ||
    col < 0 ||
    col >= playAreaSize.width
  ) {
    return null
  }

  const cell = map[row][col]
  if (isNil(cell)) {
    return null
  }

  return cell
}

export function sort(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): Tetrimino[] {
  const edges = getEdges(tetriminos, playAreaSize)
  const sortedIndices = toposort(edges)
  const sortedTetriminos = rearrange(tetriminos, sortedIndices)

  return sortedTetriminos
}
