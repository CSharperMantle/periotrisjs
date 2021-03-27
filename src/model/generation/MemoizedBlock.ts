import { Position } from "../../common/Position"
import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"
import { TetriminoNode } from "./TetriminoNode"

class MemoizedBlock extends Block {
  private _owner: TetriminoNode = null
  public get owner(): TetriminoNode {
    return this._owner
  }
  public set owner(v: TetriminoNode) {
    this._owner = v
  }

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
