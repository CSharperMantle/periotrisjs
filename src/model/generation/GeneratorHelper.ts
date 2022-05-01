import _ from "lodash"

import { Position } from "../../common"
import { Block } from "../Block"
import { Direction } from "../Direction"
import { TetriminoKind } from "../TetriminoKind"

import type { ISize } from "../../common"

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
function getBlocksMask(
  kind: TetriminoKind,
  direction: Direction
): number[][] {
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
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
          throw new Error("Invalid direction.")
      }
    default:
      throw new Error("Invalid tetrimino kind.")
  }
}

export function getFirstBlockCoordByType(
  kind: TetriminoKind,
  facingDirection: Direction
): { row: number; col: number } {
  switch (kind) {
    case TetriminoKind.Linear:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 2, col: 3 }
        case Direction.Up:
          return { row: 3, col: 1 }
        case Direction.Right:
          return { row: 1, col: 3 }
        case Direction.Down:
          return { row: 3, col: 2 }
        default:
          throw new Error("Invalid facing direction.")
      }
    case TetriminoKind.Cubic:
      return { row: 1, col: 1 }
    case TetriminoKind.LShapedCis:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 1, col: 2 }
        case Direction.Up:
          return { row: 2, col: 2 }
        case Direction.Right:
          return { row: 2, col: 0 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new Error("Invalid facing direction.")
      }
    case TetriminoKind.LShapedTrans:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 2, col: 2 }
        case Direction.Up:
          return { row: 2, col: 1 }
        case Direction.Right:
          return { row: 1, col: 2 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new Error("Invalid facing direction.")
      }
    case TetriminoKind.ZigZagCis:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 2, col: 0 }
        case Direction.Up:
          return { row: 1, col: 2 }
        case Direction.Right:
          return { row: 2, col: 1 }
        case Direction.Down:
          return { row: 2, col: 2 }
        default:
          throw new Error("Invalid facing direction.")
      }
    case TetriminoKind.ZigZagTrans:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 2, col: 1 }
        case Direction.Up:
          return { row: 1, col: 1 }
        case Direction.Right:
          return { row: 2, col: 2 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new Error("Invalid facing direction.")
      }
    case TetriminoKind.TeeShaped:
      switch (facingDirection) {
        case Direction.Left:
          return { row: 2, col: 1 }
        case Direction.Up:
          return { row: 1, col: 2 }
        case Direction.Right:
          return { row: 2, col: 1 }
        case Direction.Down:
          return { row: 2, col: 1 }
        default:
          throw new Error("Invalid facing direction.")
      }
    default:
      throw new Error("Invalid tetrimino kind.")
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
  position: Position,
  kind: TetriminoKind,
  facingDirection: Direction
): Position {
  const firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  const firstBlockRow = firstBlockCoord.row
  const firstBlockCol = firstBlockCoord.col
  return new Position(position.x - firstBlockCol, position.y - firstBlockRow)
}

export function getInitialPositionByKind(
  kind: TetriminoKind,
  playAreaSize: ISize
): Position {
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
      throw new Error("Invalid tetrimino kind.")
  }
  const row = 0
  const col = Math.floor((playAreaSize.width - length) / 2)
  return new Position(col, row)
}

export function createOffsetedBlocks(
  kind: TetriminoKind,
  offset: Position,
  direction: Direction = Direction.Up
): Block[] {
  const mask = getBlocksMask(kind, direction)
  // Performance critical with hand-written loops.
  const offsetBlocks: Block[] = new Array(4)
  const { ofsetX, offsetY } = offset
  let count = 0
  for (let nRow = 0, len_i = mask.length; nRow < len_i; nRow++) {
    const row = mask[nRow]
    for (let nCol = 0, len_j = row.length; nCol < len_j; nCol++) {
      const identifier = row[nCol]
      if (identifier !== 0) {
        offsetBlocks[count] = new Block(
          kind,
          new Position(nCol + offsetX, nRow + offsetY),
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
 * Maps the atomicNumber prop in the oldBlocks to newBlocks by id.
 * 
 * Note that this function does not change newBlocks but return a new
 * array of mapped blocks. Blocks in the returned list are NOT clones.
 * They share the same properties with their equivalences in newBlocks.
 *
 * @param oldBlocks Old blocks to be mapped from.
 * @param newBlocks New blocks to be mapped to.
 * @returns Mapped newBlocks.
 * @throws Error
 */
export function mapAtomicNumberForNewBlocks(
  oldBlocks: Block[],
  newBlocks: Block[]
): Block[] {
  if (oldBlocks.length !== newBlocks.length) {
    throw new Error("oldBlocks.length !== newBlocks.length")
  }
  const result: Block[] = []
  for (let i = 0, len = oldBlocks.length; i < len; i++) {
    const oldBlock = oldBlocks[i]
    const correspondingNewBlocks = _.filter(newBlocks,
      (newBlock: Block) => newBlock.id === oldBlock.id
    )
    for (let j = 0, len = correspondingNewBlocks.length; j < len; j++) {
      result.push({
        ...correspondingNewBlocks[j],
        atomicNumber: oldBlock.atomicNumber,
      })
    }
  }
  return result
}
