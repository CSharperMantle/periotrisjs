import _ from "lodash"
import { PlayAreaWidth } from "../../common/PeriotrisConst"
import { Position } from "../../common/Position"
import { Block } from "../Block"
import { Direction } from "../Direction"
import { TetriminoKind } from "../TetriminoKind"

const CubicMaskDown: number[][] = [
  [3, 4],
  [2, 1],
]

const CubicMaskLeft: number[][] = [
  [2, 3],
  [1, 4],
]

const CubicMaskRight: number[][] = [
  [4, 1],
  [3, 2],
]

const CubicMaskUp: number[][] = [
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

function createBlocksMask(
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
          throw new RangeError("direction")
      }
    case TetriminoKind.Cubic:
      switch (direction) {
        case Direction.Up:
          return CubicMaskUp
        case Direction.Right:
          return CubicMaskRight
        case Direction.Down:
          return CubicMaskDown
        case Direction.Left:
          return CubicMaskLeft
        default:
          throw new RangeError("direction")
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
          throw new RangeError("direction")
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
          throw new RangeError("direction")
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
          throw new RangeError("direction")
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
          throw new RangeError("direction")
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
          throw new RangeError("direction")
      }
    default:
      throw new RangeError("kind")
  }
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
          throw new RangeError("facingDirection")
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
          throw new RangeError("facingDirection")
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
          throw new RangeError("facingDirection")
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
          throw new RangeError("facingDirection")
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
          throw new RangeError("facingDirection")
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
          throw new RangeError("facingDirection")
      }
    default:
      throw new RangeError("kind")
  }
}

function getPositionByFirstBlockPosition(
  firstBlockPosition: Position,
  kind: TetriminoKind,
  facingDirection: Direction
): Position {
  let firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  let firstBlockRow = firstBlockCoord.row
  let firstBlockCol = firstBlockCoord.col
  return new Position(
    firstBlockPosition.X - firstBlockCol,
    firstBlockPosition.Y - firstBlockRow
  )
}

function getFirstBlockPositionByPosition(
  position: Position,
  kind: TetriminoKind,
  facingDirection: Direction
): Position {
  let firstBlockCoord = getFirstBlockCoordByType(kind, facingDirection)
  let firstBlockRow = firstBlockCoord.row
  let firstBlockCol = firstBlockCoord.col
  return new Position(position.X + firstBlockCol, position.Y + firstBlockRow)
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
    case TetriminoKind.Linear:
    case TetriminoKind.TeeShaped:
    case TetriminoKind.ZigZagCis:
    case TetriminoKind.ZigZagTrans:
      length = 3
      break
    default:
      throw new RangeError("kind")
  }
  let row: number = 0
  let col: number = _.floor((PlayAreaWidth - length) / 2)
  return new Position(col, row)
}

function createOffsetedBlocks(
  kind: TetriminoKind,
  offset: Position,
  direction: Direction = Direction.Up
): Block[] {
  const mask: number[][] = createBlocksMask(kind, direction)
  const offsetBlocks: Block[] = []
  for (let nRow = 0; nRow < mask.length; nRow++) {
    const row = mask[nRow]
    for (let nCol = 0; nCol < row.length; nCol++) {
      const identifier = row[nCol]
      if (identifier !== 0) {
        offsetBlocks.push(
          new Block(
            kind,
            new Position(nCol + offset.X, nRow + offset.Y),
            0,
            identifier
          )
        )
      }
    }
  }
  return offsetBlocks
}

function mapAtomicNumberForNewBlocks(
  oldBlocks: Block[],
  newBlocks: Block[]
): Block[] {
  const result: Block[] = []
  oldBlocks.forEach((oldBlock: Block) => {
    const correspondingNewBlocks: Block[] = _.filter(
      newBlocks,
      (newBlock: Block) => newBlock.id === oldBlock.id
    )
    correspondingNewBlocks.forEach((block: Block) => {
      block.atomicNumber = oldBlock.atomicNumber
      result.push(block)
    })
  })
  return result
}

export {
  createBlocksMask,
  createOffsetedBlocks,
  getFirstBlockCoordByType,
  getFirstBlockPositionByPosition,
  getPositionByFirstBlockPosition,
  getInitialPositionByKind,
  mapAtomicNumberForNewBlocks,
}
