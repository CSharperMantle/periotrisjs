import { Position } from "../../common/Position"
import { Direction } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"

class TetriminoNode extends Tetrimino {
  private _memoizedBlocks: MemoizedBlock[] = []
  public get memoizedBlocks(): MemoizedBlock[] {
    return this._memoizedBlocks
  }
  public set memoizedBlocks(v: MemoizedBlock[]) {
    this._memoizedBlocks = v
  }

  private _dependedBy: TetriminoNode[] = []
  public get dependedBy(): TetriminoNode[] {
    return this._dependedBy
  }

  private _depending: TetriminoNode[] = []
  public get depending(): TetriminoNode[] {
    return this._depending
  }

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
