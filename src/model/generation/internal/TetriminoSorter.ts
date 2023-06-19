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

import { uniq } from "lodash"
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
    tetriminos
      .map((t, index) => {
        const deps: [number, number][] = []
        for (let i = 0; i < t.blocks.length; i++) {
          const block = t.blocks[i]
          const result = tryGetOccupant(
            owners,
            block.position[1] + 1 /* Lower row... */,
            block.position[0] /* ...and same column */,
            playAreaSize
          )
          if (isNil(result) || result === index) {
            // Ignore self-dependency
            continue
          }
          // Found a result
          deps.push([result, index])
        }
        return deps
      })
      .flat()
  )
}

function tryGetOccupant(
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

  return map[row][col] ?? null
}

export function sort(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): Tetrimino[] {
  const edges = getEdges(tetriminos, playAreaSize)
  const sortedIndices = toposort(edges)
  return rearrange(tetriminos, sortedIndices)
}
