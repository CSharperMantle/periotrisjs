import _ from "lodash"

import { Position } from "../../common/Position"
import { Direction, MoveDirection, RotationDirection } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"

describe("Tetrimino", () => {
  it("should create proper blocks by position", () => {
    const t = Tetrimino.createTetriminoByPosition(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )

    const expectedBlocksPos = [
      new Position(0, 0),
      new Position(0, 1),
      new Position(1, 0),
      new Position(1, 1),
    ]

    expect(t.blocks).toHaveLength(4)
    t.blocks.forEach((block) => {
      expect(
        expectedBlocksPos.filter((pos) => pos.equals(block.position))
      ).toHaveLength(1)
    })
  })

  it("should create proper blocks by first block position", () => {
    const t = Tetrimino.createTetriminoByFirstBlockPosition(
      TetriminoKind.Linear,
      new Position(3, 0),
      Direction.Left
    )

    const expectedBlocksPos = [
      new Position(0, 0),
      new Position(1, 0),
      new Position(2, 0),
      new Position(3, 0),
    ]

    expect(t.blocks).toHaveLength(4)
    t.blocks.forEach((block) => {
      expect(
        expectedBlocksPos.filter((pos) => pos.equals(block.position)).length
      ).toBe(1)
    })
  })

  it("should have correct tryMove() behavior", () => {
    const t = Tetrimino.createTetriminoByPosition(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )
    const p = _.cloneDeep(t.position)
    const b = _.cloneDeep(t.blocks)

    // Move down.
    expect(t.tryMove(MoveDirection.Down, () => false)).toBe(true)
    expect(t.position.equals(new Position(p.x, p.y + 1))).toBe(true)
    // Make sure all blocks are in their position.
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.x, block.position.y + 1)
        )
      ).toBe(true)
    })
    // Move right.
    expect(t.tryMove(MoveDirection.Right, () => false)).toBe(true)
    expect(t.position.equals(new Position(p.x + 1, p.y + 1))).toBe(true)
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.x + 1, block.position.y + 1)
        )
      ).toBe(true)
    })
    // This moving attempt should fail. It's position should be preserved.
    expect(t.tryMove(MoveDirection.Right, () => true)).toBe(false)
    expect(t.position.equals(new Position(p.x + 1, p.y + 1))).toBe(true)
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.x + 1, block.position.y + 1)
        )
      ).toBe(true)
    })
  })

  it("should have correct tryRotate() behavior", () => {
    const t = Tetrimino.createTetriminoByFirstBlockPosition(
      TetriminoKind.Cubic,
      new Position(5, 5),
      Direction.Up
    )
    const b = _.cloneDeep(t.blocks)

    // Rotate back and forth
    expect(t.tryRotate(RotationDirection.Right, () => false)).toBe(true)
    // Rotate back
    expect(t.tryRotate(RotationDirection.Left, () => false)).toBe(true)
    t.blocks.forEach((block) => {
      const origBlks = b.filter((origBlk) => origBlk.id === block.id)
      expect(origBlks).toHaveLength(1)
      expect(origBlks[0].position.equals(block.position)).toBe(true)
    })
    // This should not change the state
    expect(t.tryRotate(RotationDirection.Right, () => true)).toBe(false)
    t.blocks.forEach((block) => {
      const origBlks = b.filter((origBlk) => origBlk.id === block.id)
      expect(origBlks).toHaveLength(1)
      expect(origBlks[0].position.equals(block.position)).toBe(true)
    })
  })
})
