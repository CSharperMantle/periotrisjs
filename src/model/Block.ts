import { Position } from "../common"
import { TetriminoKind } from "./TetriminoKind"

/**
 * The block, the most basic unit of the game.
 */
export class Block {
  public constructor(
    public readonly filledBy: TetriminoKind,
    public readonly position: Position,
    public readonly atomicNumber = 0,
    public readonly id = 0
  ) {}
}
