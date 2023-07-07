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

import { range, shuffle } from "lodash"

import { isNil } from "../../../common"
import { countFreeBlocks } from "../../../customization"
import { Direction, RotationDirection } from "../../Direction"
import { Tetrimino, repairBrokenTetriminos } from "../../Tetrimino"
import {
  getInitialPosition,
  getPositionByFirstBlock,
} from "../../TetriminoHelper"
import { TetriminoKind } from "../../TetriminoKind"
import { sort } from "./TetriminoSorter"

import type { ISize, TPosition } from "../../../common"
import type { IMap } from "../../../customization"
import type { IBlock } from "../../IBlock"

type TPropPair = readonly [TetriminoKind, Direction]

function fastRandom(startInc: number, endExc: number): number {
  return startInc + Math.floor(Math.random() * (endExc - startInc))
}

function spliceLast<T>(array: T[]): T {
  const elem = array.pop()
  if (isNil(elem)) {
    throw new Error("spliceLast: array is empty")
  }
  return elem
}

export type TProgressCallback = (progress: number) => void

export class NoSolutionError extends Error {}

export async function getPlayablePattern(
  gameMap: IMap,
  progressCallback?: TProgressCallback
): Promise<Tetrimino[]> {
  const template = gameMap.map
  const atomicNumberMap = template.map((row) =>
    row.map((block) => block.atomicNumber)
  )
  const freeBlockMap = template.map((row) => row.map((block) => !block.filled))

  const ordered = sort(
    await getPossibleTetriminoPattern(
      freeBlockMap,
      atomicNumberMap,
      countFreeBlocks(gameMap),
      progressCallback
    ),
    gameMap.playAreaSize
  )

  const fixedTetriminos = repairBrokenTetriminos(ordered)
  primeTetriminos(fixedTetriminos, gameMap.playAreaSize)
  return fixedTetriminos
}

const AllPropPairPermutation = [
  TetriminoKind.LShapedCis,
  TetriminoKind.LShapedTrans,
  TetriminoKind.Linear,
  TetriminoKind.TeeShaped,
  TetriminoKind.ZigZagCis,
  TetriminoKind.ZigZagTrans,
]
  .flatMap<TPropPair, undefined>((k) => [
    [k, Direction.Left],
    [k, Direction.Up],
    [k, Direction.Right],
    [k, Direction.Down],
  ])
  .concat([[TetriminoKind.Cubic, Direction.Left]])

async function getPossibleTetriminoPattern(
  freeBlockMap: boolean[][],
  atomicNumberMap: number[][],
  freeBlocksCount: number,
  progressCallback?: TProgressCallback
): Promise<Tetrimino[]> {
  const settledTetriminos: Tetrimino[] = []
  const pairIndicesStack: number[][] = []
  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (freeBlocksCount <= 0) {
      // All blocks settled, exiting
      break
    }
    let currentIndices: number[]
    if (!rewindingRequired) {
      currentIndices = shuffle(range(0, AllPropPairPermutation.length))
    } else {
      if (settledTetriminos.length === 0) {
        throw new NoSolutionError()
      }
      currentIndices = spliceLast(pairIndicesStack)

      const lastTetrimino = spliceLast(settledTetriminos)
      lastTetrimino.blocks.forEach((b) => {
        freeBlockMap[b.position[1]][b.position[0]] = true
      })
      freeBlocksCount += lastTetrimino.blocks.length
    }

    const firstBlockCoord = getFirstFreeBlockCoord(freeBlockMap)
    rewindingRequired = true
    while (currentIndices.length > 0) {
      const [kind, direction] =
        AllPropPairPermutation[spliceLast(currentIndices)]
      const tetrimino = new Tetrimino(
        kind,
        getPositionByFirstBlock(firstBlockCoord, kind, direction),
        direction
      )
      if (
        !tetrimino.blocks.some(collisionChecker.bind(undefined, freeBlockMap))
      ) {
        // We have found a seemingly possible choice for this target,
        // thus saving our states now.
        settledTetriminos.push(tetrimino)
        pairIndicesStack.push(currentIndices)
        tetrimino.blocks.forEach((b) => {
          freeBlockMap[b.position[1]][b.position[0]] = false
        })
        freeBlocksCount -= tetrimino.blocks.length
        progressCallback?.(freeBlocksCount)
        rewindingRequired = false
        break
      }
      if (!rewindingRequired) {
        break
      }
    }
  }
  // Now that we have found a solution, we need to map atomic numbers from
  // old template into newly-generated map.
  settledTetriminos.forEach((t) => {
    t.blocks.forEach((b) => {
      b.atomicNumber = atomicNumberMap[b.position[1]][b.position[0]]
    })
  })

  return settledTetriminos
}

function collisionChecker(freeBlockMap: boolean[][], block: IBlock): boolean {
  const nRow = block.position[1]
  const nCol = block.position[0]
  if (
    nCol < 0 ||
    nCol >= freeBlockMap[0].length ||
    nRow < 0 ||
    nRow >= freeBlockMap.length
  ) {
    return true
  }
  return !freeBlockMap[nRow][nCol]
}

function getFirstFreeBlockCoord(freeBlockMap: boolean[][]): TPosition {
  for (let nRow = freeBlockMap.length - 1; nRow >= 0; nRow--) {
    const col = freeBlockMap[nRow]
    for (let nCol = col.length - 1; nCol >= 0; nCol--) {
      if (col[nCol]) {
        return [nCol, nRow]
      }
    }
  }
  return [-1, -1]
}

/**
 * "Prime" the tetriminos, that is, move them to the top center of play
 * area and rotate them randomly for initial direction.
 *
 * @param tetriminos The tetriminos to prime.
 * @param playAreaSize Size of play area.
 */
function primeTetriminos(tetriminos: Tetrimino[], playAreaSize: ISize) {
  // Move to initial position and rotate randomly
  tetriminos.forEach((tetrimino) => {
    const originalPos = tetrimino.position
    const newPos = getInitialPosition(tetrimino.kind, playAreaSize)
    const deltaX = newPos[0] - originalPos[0]
    const deltaY = newPos[1] - originalPos[1]

    tetrimino.blocks = tetrimino.blocks.map((block) => ({
      filledBy: block.filledBy,
      position: [block.position[0] + deltaX, block.position[1] + deltaY],
      atomicNumber: block.atomicNumber,
      id: block.id,
    }))
    tetrimino.position = newPos

    const rotationCount = fastRandom(0, Math.floor(Direction.LENGTH / 2) + 1)
    for (let i = 0; i < rotationCount; i++) {
      tetrimino.tryRotate(RotationDirection.Right, () => false)
    }
  })
}
