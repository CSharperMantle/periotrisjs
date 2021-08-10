import { Position } from "../../../common/Position"
import { Direction } from "../../Direction"
import { Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { TetriminoNode } from "../TetriminoNode"

describe("TetriminoNode", () => {
  it("should be initialized with proper props", () => {
    const t = Tetrimino.createTetriminoByPosition(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )
    const n = new TetriminoNode(
      t.kind,
      t.position,
      t.firstBlockPosition,
      t.facingDirection
    )

    expect(n.depending).toBeInstanceOf(Set)
    expect(n.depending.size).toBe<number>(0)
    expect(n.dependedBy).toBeInstanceOf(Set)
    expect(n.dependedBy.size).toBe<number>(0)
  })
})
