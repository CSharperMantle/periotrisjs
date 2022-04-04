import { Position } from "../../../common"
import { Block } from "../../Block"
import { Direction } from "../../Direction"
import { Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"

class TetriminoNode extends Tetrimino {
  public memoizedBlocks: MemoizedBlock[] = []

  public readonly dependedBy: Set<TetriminoNode> = new Set<TetriminoNode>()

  public readonly depending: Set<TetriminoNode> = new Set<TetriminoNode>()

  public constructor(
    public kind: TetriminoKind,
    public position: Position,
    public facingDirection: Direction,
    originalTetrimino: Tetrimino
  ) {
    super(kind, position, facingDirection)
    this.memoizedBlocks = Array.from(
      originalTetrimino.blocks,
      (block: Block) => {
        return new MemoizedBlock(
          block.filledBy,
          block.position,
          this,
          block.atomicNumber,
          block.id
        )
      }
    )
    this.blocks = this.memoizedBlocks
  }
}

export { TetriminoNode }
