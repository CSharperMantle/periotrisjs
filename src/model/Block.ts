import { Position } from "../common/Position"
import { TetriminoKind } from "./TetriminoKind"

class Block {
  public filledBy: TetriminoKind

  public position: Position

  public atomicNumber: number

  public id: number

  public constructor(
    filledBy: TetriminoKind,
    position: Position,
    atomicNumber = 0,
    id = 0
  ) {
    this.filledBy = filledBy
    this.position = position
    this.atomicNumber = atomicNumber
    this.id = id
  }
}

export { Block }
