import { Position } from "../../common"
import { Direction } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"

class TetriminoNode extends Tetrimino {
  public memoizedBlocks: MemoizedBlock[] = []

  public readonly dependedBy: Set<TetriminoNode> = new Set<TetriminoNode>()

  public readonly depending: Set<TetriminoNode> = new Set<TetriminoNode>()

  public constructor(
    kind: TetriminoKind,
    position: Position,
    firstBlockPos: Position,
    facingDirection: Direction
  ) {
    super(kind, position, firstBlockPos, facingDirection)
  }
}

export { TetriminoNode }
