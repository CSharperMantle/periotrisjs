import { Position } from "../../common/Position"
import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"
import { TetriminoNode } from "./TetriminoNode"

class MemoizedBlock extends Block {
  public owner: TetriminoNode

  public constructor(
    filledBy: TetriminoKind,
    position: Position,
    owner: TetriminoNode,
    atomicNumber: number,
    identifier: number
  ) {
    super(filledBy, position, atomicNumber, identifier)
    this.owner = owner
  }
}

export { MemoizedBlock }
