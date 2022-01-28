import _ from "lodash"

import { PlayAreaWidth, Position } from "../../common"
import { Block } from "../Block"
import { Direction } from "../Direction"
import { TetriminoKind } from "../TetriminoKind"

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

const BlocksMaskMapping = {
  0: {
    // TetriminoKind.Linear
    0: LinearLeftMask,
    1: LinearUpMask,
    2: LinearRightMask,
    3: LinearDownMask,
  },
  1: {
    // TetriminoKind.Cubic
    0: CubicUpMask,
    1: CubicRightMask,
    2: CubicDownMask,
    3: CubicLeftMask,
  },
  2: {
    // TetriminoKind.LShapedCis
    0: LCisUpMask,
    1: LCisRightMask,
    2: LCisDownMask,
    3: LCisLeftMask,
  },
  3: {
    // TetriminoKind.LShapedTrans
    0: LTransUpMask,
    1: LTransRightMask,
    2: LTransDownMask,
    3: LTransLeftMask,
  },
  4: {
    // TetriminoKind.ZigZagCis
    0: ZCisUpMask,
    1: ZCisRightMask,
    2: ZCisDownMask,
    3: ZCisLeftMask,
  },
  5: {
    // TetriminoKind.ZigZagTrans
    0: ZTransUpMask,
    1: ZTransRightMask,
    2: ZTransDownMask,
    3: ZTransLeftMask,
  },
  6: {
    // TetriminoKind.TeeShaped
    0: TeeUpMask,
    1: TeeRightMask,
    2: TeeDownMask,
    3: TeeLeftMask,
  },
}

/**
 * Creates mask for blocks.
 * @param kind Kind of the tetrimino.
 * @param direction Direction of the tetrimino.
 * @returns An 'number[][]' of the mask.
 *
 * @throws RangeError
 */
function createBlocksMask(
  kind: TetriminoKind,
  direction: Direction
): number[][] {
  if (
    kind === TetriminoKind.AvailableToFill ||
    kind === TetriminoKind.UnavailableToFill ||
    kind > TetriminoKind.UnavailableToFill
  ) {
    throw new Error("Invalid tetrimino kind.")
  }
  if (direction > 3) {
    throw new Error("Invalid direction.")
  }
  return BlocksMaskMapping[kind][direction]
}

function getFirstBlockCoordByType(
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

function getPositionByFirstBlockPosition(
  firstBlockPosition: Position,
  kind: TetriminoKind,
  facingDirection: Direction
): Position {
  const firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  const firstBlockRow = firstBlockCoord.row
  const firstBlockCol = firstBlockCoord.col
  return new Position(
    firstBlockPosition.x - firstBlockCol,
    firstBlockPosition.y - firstBlockRow
  )
}

function getFirstBlockPositionByPosition(
  position: Position,
  kind: TetriminoKind,
  facingDirection: Direction
): Position {
  const firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  const firstBlockRow = firstBlockCoord.row
  const firstBlockCol = firstBlockCoord.col
  return new Position(position.x + firstBlockCol, position.y + firstBlockRow)
}

function getInitialPositionByKind(kind: TetriminoKind): Position {
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
      throw new RangeError("kind")
  }
  const row = 0
  const col = Math.floor((PlayAreaWidth - length) / 2)
  return new Position(col, row)
}

function createOffsetedBlocks(
  kind: TetriminoKind,
  offset: Position,
  direction: Direction = Direction.Up
): Block[] {
  const mask = createBlocksMask(kind, direction)
  const offsetBlocks: Block[] = []
  for (let nRow = 0; nRow < mask.length; nRow++) {
    const row = mask[nRow]
    for (let nCol = 0; nCol < row.length; nCol++) {
      const identifier = row[nCol]
      if (identifier !== 0) {
        offsetBlocks.push(
          new Block(
            kind,
            new Position(nCol + offset.x, nRow + offset.y),
            0,
            identifier
          )
        )
      }
    }
  }
  return offsetBlocks
}

/**
 * Maps the atomicNumber prop in the oldBlocks to newBlocks by id.
 * Note that this function does not change newBlocks but return a new
 * array of mapped blocks.
 * @param oldBlocks Old blocks to be mapped from.
 * @param newBlocks New blocks to be mapped to.
 * @returns Mapped newBlocks.
 * @throws Error
 */
function mapAtomicNumberForNewBlocks(
  oldBlocks: Block[],
  newBlocks: Block[]
): Block[] {
  if (oldBlocks.length !== newBlocks.length) {
    throw new Error("oldBlocks.length !== newBlocks.length")
  }
  const result: Block[] = []
  oldBlocks.forEach((oldBlock: Block) => {
    const correspondingNewBlocks = _.cloneDeep(
      newBlocks.filter((newBlock: Block) => newBlock.id === oldBlock.id)
    )

    correspondingNewBlocks.forEach((block: Block) => {
      block.atomicNumber = oldBlock.atomicNumber
      result.push(block)
    })
  })
  return result
}

export {
  createOffsetedBlocks,
  getFirstBlockCoordByType,
  getFirstBlockPositionByPosition,
  getPositionByFirstBlockPosition,
  getInitialPositionByKind,
  mapAtomicNumberForNewBlocks,
}
