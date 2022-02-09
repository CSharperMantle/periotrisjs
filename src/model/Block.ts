import { Position } from "../common"
import { TetriminoKind } from "./TetriminoKind"

class Block {
  public constructor(
    public filledBy: TetriminoKind,
    public position: Position,
    public atomicNumber = 0,
    public id = 0
  ) {}
}

export { Block }
