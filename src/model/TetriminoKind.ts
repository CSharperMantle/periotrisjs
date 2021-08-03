import { random } from "lodash"

enum TetriminoKind {
  Linear,

  Cubic,

  LShapedCis,

  LShapedTrans,

  ZigZagCis,

  ZigZagTrans,

  TeeShaped,

  AvailableToFill,

  UnavailableToFill,
}

function getRandomTetriminoKind(): TetriminoKind {
  let randResult = random(0, 7, false)
  switch (randResult) {
    case 0:
      return TetriminoKind.Linear
    case 1:
      return TetriminoKind.Cubic
    case 2:
      return TetriminoKind.LShapedCis
    case 3:
      return TetriminoKind.LShapedTrans
    case 4:
      return TetriminoKind.ZigZagCis
    case 5:
      return TetriminoKind.ZigZagTrans
    case 6:
      return TetriminoKind.TeeShaped
    default:
      throw new RangeError()
  }
}

export { TetriminoKind, getRandomTetriminoKind }
