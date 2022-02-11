import { Position } from "../../../common"
import { Block } from "../../Block"
import { TetriminoKind } from "../../TetriminoKind"
import { TetriminoNode } from "./TetriminoNode"

class MemoizedBlock extends Block {
  public constructor(
    public filledBy: TetriminoKind,
    public position: Position,
    public owner: TetriminoNode,
    public atomicNumber: number,
    public identifier: number
  ) {
    super(filledBy, position, atomicNumber, identifier)
  }
}

export { MemoizedBlock }
