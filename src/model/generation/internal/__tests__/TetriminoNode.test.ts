import { Position } from "../../../../common"
import { Direction } from "../../../Direction"
import { Tetrimino } from "../../../Tetrimino"
import { TetriminoKind } from "../../../TetriminoKind"
import { TetriminoNode } from "../TetriminoNode"

describe("TetriminoNode", () => {
  it("should be initialized with proper props", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )
    const n = new TetriminoNode(t.kind, t.position, t.facingDirection, t)

    expect(n.depending).toBeInstanceOf(Set)
    expect(n.depending.size).toBe(0)
    expect(n.dependedBy).toBeInstanceOf(Set)
    expect(n.dependedBy.size).toBe(0)
  })
})
