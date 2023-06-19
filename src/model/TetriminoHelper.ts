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

import { filter, head } from "lodash"

import { Block } from "./Block"
import { Direction } from "./Direction"
import { TetriminoKind } from "./TetriminoKind"

import type { ISize, TPosition } from "../common"

const CubicDownMask: number[][] = [
  [3, 4],
  [2, 1],
]

const CubicLeftMask: number[][] = [
  [2, 3],
  [1, 4],
]

const CubicRightMask: number[][] = [
  [4, 1],
  [3, 2],
]

const CubicUpMask: number[][] = [
  [1, 2],
  [4, 3],
]

const LCisDownMask: number[][] = [
  [4, 3, 0],
  [0, 2, 0],
  [0, 1, 0],
]

const LCisLeftMask: number[][] = [
  [0, 0, 4],
  [1, 2, 3],
  [0, 0, 0],
]

const LCisRightMask: number[][] = [
  [0, 0, 0],
  [3, 2, 1],
  [4, 0, 0],
]

const LCisUpMask: number[][] = [
  [0, 1, 0],
  [0, 2, 0],
  [0, 3, 4],
]

const LinearDownMask: number[][] = [
  [0, 0, 4, 0],
  [0, 0, 3, 0],
  [0, 0, 2, 0],
  [0, 0, 1, 0],
]

const LinearLeftMask: number[][] = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 2, 3, 4],
  [0, 0, 0, 0],
]

const LinearRightMask: number[][] = [
  [0, 0, 0, 0],
  [4, 3, 2, 1],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]

const LinearUpMask: number[][] = [
  [0, 1, 0, 0],
  [0, 2, 0, 0],
  [0, 3, 0, 0],
  [0, 4, 0, 0],
]

const LTransDownMask: number[][] = [
  [0, 3, 4],
  [0, 2, 0],
  [0, 1, 0],
]

const LTransLeftMask: number[][] = [
  [0, 0, 0],
  [1, 2, 3],
  [0, 0, 4],
]

const LTransRightMask: number[][] = [
  [4, 0, 0],
  [3, 2, 1],
  [0, 0, 0],
]

const LTransUpMask: number[][] = [
  [0, 1, 0],
  [0, 2, 0],
  [4, 3, 0],
]

const TeeDownMask: number[][] = [
  [0, 0, 0],
  [4, 3, 2],
  [0, 1, 0],
]

const TeeLeftMask: number[][] = [
  [0, 4, 0],
  [1, 3, 0],
  [0, 2, 0],
]

const TeeRightMask: number[][] = [
  [0, 2, 0],
  [0, 3, 1],
  [0, 4, 0],
]

const TeeUpMask: number[][] = [
  [0, 1, 0],
  [2, 3, 4],
  [0, 0, 0],
]

const ZCisDownMask: number[][] = [
  [0, 0, 0],
  [4, 3, 0],
  [0, 2, 1],
]

const ZCisLeftMask: number[][] = [
  [0, 4, 0],
  [2, 3, 0],
  [1, 0, 0],
]

const ZCisRightMask: number[][] = [
  [0, 0, 1],
  [0, 3, 2],
  [0, 4, 0],
]

const ZCisUpMask: number[][] = [
  [1, 2, 0],
  [0, 3, 4],
  [0, 0, 0],
]

const ZTransDownMask: number[][] = [
  [0, 0, 0],
  [0, 2, 1],
  [4, 3, 0],
]

const ZTransLeftMask: number[][] = [
  [4, 0, 0],
  [3, 2, 0],
  [0, 1, 0],
]

const ZTransRightMask: number[][] = [
  [0, 1, 0],
  [0, 2, 3],
  [0, 0, 4],
]

const ZTransUpMask: number[][] = [
  [0, 3, 4],
  [1, 2, 0],
  [0, 0, 0],
]

/**
 * Creates mask for blocks.
 * @param kind Kind of the tetrimino.
 * @param direction Direction of the tetrimino.
 * @returns An 'number[][]' of the mask.
 *
 * @throws Error
 */
function getBlocksMask(kind: TetriminoKind, direction: Direction): number[][] {
  switch (kind) {
    case TetriminoKind.Linear:
      switch (direction) {
        case Direction.Left:
          return LinearLeftMask
        case Direction.Up:
          return LinearUpMask
        case Direction.Right:
          return LinearRightMask
        case Direction.Down:
          return LinearDownMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.Cubic:
      switch (direction) {
        case Direction.Up:
          return CubicUpMask
        case Direction.Right:
          return CubicRightMask
        case Direction.Down:
          return CubicDownMask
        case Direction.Left:
          return CubicLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.LShapedCis:
      switch (direction) {
        case Direction.Up:
          return LCisUpMask
        case Direction.Right:
          return LCisRightMask
        case Direction.Down:
          return LCisDownMask
        case Direction.Left:
          return LCisLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.LShapedTrans:
      switch (direction) {
        case Direction.Up:
          return LTransUpMask
        case Direction.Right:
          return LTransRightMask
        case Direction.Down:
          return LTransDownMask
        case Direction.Left:
          return LTransLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.ZigZagCis:
      switch (direction) {
        case Direction.Up:
          return ZCisUpMask
        case Direction.Right:
          return ZCisRightMask
        case Direction.Down:
          return ZCisDownMask
        case Direction.Left:
          return ZCisLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.ZigZagTrans:
      switch (direction) {
        case Direction.Up:
          return ZTransUpMask
        case Direction.Right:
          return ZTransRightMask
        case Direction.Down:
          return ZTransDownMask
        case Direction.Left:
          return ZTransLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    case TetriminoKind.TeeShaped:
      switch (direction) {
        case Direction.Up:
          return TeeUpMask
        case Direction.Right:
          return TeeRightMask
        case Direction.Down:
          return TeeDownMask
        case Direction.Left:
          return TeeLeftMask
        default:
          throw new RangeError(`getBlocksMask: invalid direction ${direction}`)
      }
    default:
      throw new RangeError(`getBlocksMask: invalid kind ${kind}`)
  }
}

export function getFirstBlockCoordByType(
  kind: TetriminoKind,
  direction: Direction
): { row: number; col: number } {
  switch (kind) {
    case TetriminoKind.Linear:
      switch (direction) {
        case Direction.Left:
          return { row: 2, col: 3 }
        case Direction.Up:
          return { row: 3, col: 1 }
        case Direction.Right:
          return { row: 1, col: 3 }
        case Direction.Down:
          return { row: 3, col: 2 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    case TetriminoKind.Cubic:
      return { row: 1, col: 1 }
    case TetriminoKind.LShapedCis:
      switch (direction) {
        case Direction.Left:
          return { row: 1, col: 2 }
        case Direction.Up:
          return { row: 2, col: 2 }
        case Direction.Right:
          return { row: 2, col: 0 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    case TetriminoKind.LShapedTrans:
      switch (direction) {
        case Direction.Left:
          return { row: 2, col: 2 }
        case Direction.Up:
          return { row: 2, col: 1 }
        case Direction.Right:
          return { row: 1, col: 2 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    case TetriminoKind.ZigZagCis:
      switch (direction) {
        case Direction.Left:
          return { row: 2, col: 0 }
        case Direction.Up:
          return { row: 1, col: 2 }
        case Direction.Right:
          return { row: 2, col: 1 }
        case Direction.Down:
          return { row: 2, col: 2 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    case TetriminoKind.ZigZagTrans:
      switch (direction) {
        case Direction.Left:
          return { row: 2, col: 1 }
        case Direction.Up:
          return { row: 1, col: 1 }
        case Direction.Right:
          return { row: 2, col: 2 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    case TetriminoKind.TeeShaped:
      switch (direction) {
        case Direction.Left:
          return { row: 2, col: 1 }
        case Direction.Up:
          return { row: 1, col: 2 }
        case Direction.Right:
          return { row: 2, col: 1 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new RangeError(
            `getFirstBlockCoordByType: invalid direction ${direction}`
          )
      }
    default:
      throw new RangeError(`getFirstBlockCoordByType: invalid kind ${kind}`)
  }
}

/**
 * Get the position of a tetrimino by its first block position.
 *
 * @see {@link getFirstBlockCoordByType}
 *
 * @param position Position to transform.
 * @param kind Kind of the Tetrimino.
 * @param facingDirection Facing direction of the Tetrimino.
 * @returns The transformed position.
 */
export function getPositionByFirstBlock(
  position: TPosition,
  kind: TetriminoKind,
  facingDirection: Direction
): TPosition {
  const firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  const firstBlockRow = firstBlockCoord.row
  const firstBlockCol = firstBlockCoord.col
  return [position[0] - firstBlockCol, position[1] - firstBlockRow]
}

export function getInitialPosition(
  kind: TetriminoKind,
  playAreaSize: ISize
): TPosition {
  let length: number
  switch (kind) {
    case TetriminoKind.Linear:
      length = 4
      break
    case TetriminoKind.Cubic:
      length = 2
      break
    case TetriminoKind.LShapedCis:
    case TetriminoKind.LShapedTrans:
    case TetriminoKind.TeeShaped:
    case TetriminoKind.ZigZagCis:
    case TetriminoKind.ZigZagTrans:
      length = 3
      break
    default:
      throw new RangeError(`getInitialPosition: invalid kind ${kind}`)
  }
  return [Math.floor((playAreaSize.width - length) / 2), 0]
}

export function createOffsetBlocks(
  kind: TetriminoKind,
  offset: TPosition,
  direction: Direction = Direction.Up
): Block[] {
  const mask = getBlocksMask(kind, direction)
  // Performance critical with hand-written loops.
  const offsetBlocks: Block[] = new Array(4)
  const [x, y] = offset
  let count = 0
  for (let nRow = 0, len_i = mask.length; nRow < len_i; nRow++) {
    const row = mask[nRow]
    for (let nCol = 0, len_j = row.length; nCol < len_j; nCol++) {
      const identifier = row[nCol]
      if (identifier !== 0) {
        offsetBlocks[count] = new Block(
          kind,
          [nCol + x, nRow + y],
          0,
          identifier
        )
        count += 1
      }
    }
  }
  return offsetBlocks
}

/**
 * Maps the atomicNumber prop in the oldBlocks to newBlocks by block ID.
 *
 * @param oldBlocks Old blocks to be mapped from.
 * @param newBlocks New blocks to be mapped to.
 * @returns Mapped newBlocks.
 * @throws Error
 */
export function mapAtomicNumberInto(
  oldBlocks: Block[],
  newBlocks: Block[]
): void {
  if (oldBlocks.length !== newBlocks.length) {
    throw new Error(
      `mapAtomicNumberInto: length mismatch ${oldBlocks.length}!==${newBlocks.length}`
    )
  }
  newBlocks.forEach((n) => {
    const o = head(filter(oldBlocks, (b) => n.id === b.id))
    n.atomicNumber = o?.atomicNumber ?? 0
  })
}
