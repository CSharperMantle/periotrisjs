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

import { shuffle } from "lodash"

import { isNil } from "../../../common"
import { Block } from "../../Block"
import { Direction, RotationDirection } from "../../Direction"
import { Tetrimino, repairBrokenTetriminos } from "../../Tetrimino"
import {
  getInitialPositionByKind,
  getPositionByFirstBlock,
} from "../../TetriminoHelper"
import { TetriminoKind } from "../../TetriminoKind"
import { sort } from "./TetriminoSorter"

import type { TPosition, ISize } from "../../../common"
import type { IMap } from "../../../customization"

function fastRandom(startInc: number, endExc: number): number {
  return startInc + Math.floor(Math.random() * (endExc - startInc))
}

export async function getPlayablePattern(gameMap: IMap): Promise<Tetrimino[]> {
  const template: Block[][] = new Array(gameMap.playAreaSize.height)
  for (let nRow = 0; nRow < gameMap.playAreaSize.height; nRow++) {
    const row = new Array(gameMap.playAreaSize.width)
    for (let nCol = 0; nCol < gameMap.playAreaSize.width; nCol++) {
      const origElem = gameMap.map[nRow][nCol]
      row[nCol] = new Block(
        origElem.filledBy,
        [nCol, nRow],
        origElem.atomicNumber,
        0
      )
    }
    template[nRow] = row
  }

  const ordered = sort(
    await getPossibleTetriminoPattern(
      template,
      gameMap.totalAvailableBlocksCount
    ),
    gameMap.playAreaSize
  )

  const fixedTetriminos = repairBrokenTetriminos(ordered)
  primeTetriminos(fixedTetriminos, gameMap.playAreaSize)
  return fixedTetriminos
}

async function getPossibleTetriminoPattern(
  template: Block[][],
  freeBlocksCount: number
): Promise<Tetrimino[]> {
  const freeBlockMap = template.map((row) =>
    row.map((block) => block.filledBy === TetriminoKind.Free)
  )

  const settledTetriminos: Tetrimino[] = []
  const pendingTetriminoKinds: KindDirectionsPair[][] = []
  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (freeBlocksCount <= 0) {
      return settledTetriminos
    }

    let currentKindDirectionsPairStack: KindDirectionsPair[]
    if (!rewindingRequired) {
      currentKindDirectionsPairStack = createShuffledKindDirectionsPairs()
    } else {
      if (settledTetriminos.length === 0) {
        return settledTetriminos
      }

      const poppedKinds = pendingTetriminoKinds.pop()
      if (isNil(poppedKinds)) {
        throw new Error("poppedKinds")
      }
      currentKindDirectionsPairStack = poppedKinds

      const lastTetrimino = settledTetriminos.pop()
      if (isNil(lastTetrimino)) {
        throw new Error("lastTetrimino")
      }

      lastTetrimino.blocks.forEach((block) => {
        freeBlockMap[block.position[1]][block.position[0]] = true
      })
      freeBlocksCount += lastTetrimino.blocks.length
    }

    const firstBlockCoord = getFirstFreeBlockCoord(freeBlockMap)

    let solutionFound = false
    while (currentKindDirectionsPairStack.length > 0) {
      const currentPair = currentKindDirectionsPairStack.pop()
      if (isNil(currentPair)) {
        throw new Error("currentPair")
      }
      while (currentPair.directions.length > 0) {
        const direction = currentPair.popRandomDirection()
        const tetrimino = new Tetrimino(
          currentPair.kind,
          getPositionByFirstBlock(firstBlockCoord, currentPair.kind, direction),
          direction
        )
        if (
          !tetrimino.blocks.some(collisionChecker.bind(undefined, freeBlockMap))
        ) {
          settledTetriminos.push(tetrimino)
          pendingTetriminoKinds.push(currentKindDirectionsPairStack)
          for (let i = 0, len = tetrimino.blocks.length; i < len; i++) {
            const oldBlock = tetrimino.blocks[i]
            const newBlock = {
              ...oldBlock,
              atomicNumber:
                template[oldBlock.position[1]][oldBlock.position[0]]
                  .atomicNumber,
            }
            freeBlockMap[newBlock.position[1]][newBlock.position[0]] = false
            tetrimino.blocks[i] = newBlock
          }
          freeBlocksCount -= tetrimino.blocks.length
          solutionFound = true
          break
        }
      }
      if (solutionFound) {
        break
      }
    }
    rewindingRequired = !solutionFound
  }
}

function createShuffledKindDirectionsPairs(): KindDirectionsPair[] {
  return shuffle([
    new KindDirectionsPair(TetriminoKind.Cubic),
    new KindDirectionsPair(TetriminoKind.LShapedCis),
    new KindDirectionsPair(TetriminoKind.LShapedTrans),
    new KindDirectionsPair(TetriminoKind.Linear),
    new KindDirectionsPair(TetriminoKind.TeeShaped),
    new KindDirectionsPair(TetriminoKind.ZigZagCis),
    new KindDirectionsPair(TetriminoKind.ZigZagTrans),
  ])
}

function collisionChecker(freeBlockMap: boolean[][], block: Block): boolean {
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

class KindDirectionsPair {
  public readonly kind: TetriminoKind
  public readonly directions: Direction[]

  public constructor(kind: TetriminoKind) {
    this.kind = kind
    this.directions = [
      Direction.Up,
      Direction.Down,
      Direction.Left,
      Direction.Right,
    ]
  }

  public popRandomDirection(): Direction {
    const index = fastRandom(0, this.directions.length)
    return this.directions.splice(index)[0]
  }
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
    const newPos = getInitialPositionByKind(tetrimino.kind, playAreaSize)
    const deltaX = newPos[0] - originalPos[0]
    const deltaY = newPos[1] - originalPos[1]

    tetrimino.blocks = tetrimino.blocks.map(
      (block) =>
        new Block(
          block.filledBy,
          [block.position[0] + deltaX, block.position[1] + deltaY],
          block.atomicNumber,
          block.id
        )
    )
    tetrimino.position = newPos

    const rotationCount = fastRandom(
      0,
      Math.floor(Object.keys(Direction).length / 2) + 1
    )
    for (let i = 0; i < rotationCount; i++) {
      tetrimino.tryRotate(RotationDirection.Right, () => false)
    }
  })
}
