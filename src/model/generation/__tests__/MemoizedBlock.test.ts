import { Position } from "../../../common"
import { Direction } from "../../Direction"
import { Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { MemoizedBlock } from "../MemoizedBlock"
import { TetriminoNode } from "../TetriminoNode"

describe("MemoizedBlock", () => {
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
    const b = new MemoizedBlock(
      n.kind,
      n.blocks[0].position,
      n,
      n.blocks[0].atomicNumber,
      n.blocks[0].id
    )

    expect(b.owner).toBe(n)
  })
})
