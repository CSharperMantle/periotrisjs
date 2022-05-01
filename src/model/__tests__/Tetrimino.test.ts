import _ from "lodash"

import { Position, positionEquals } from "../../common"
import { Direction, MoveDirection, RotationDirection } from "../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../Tetrimino"
import { getPositionByFirstBlock } from "../TetriminoHelper"
import { TetriminoKind } from "../TetriminoKind"

function structuredClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

describe("Tetrimino", () => {
  it("should create proper blocks by position", () => {
    const t = new Tetrimino(
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
        expectedBlocksPos.filter((pos) => positionEquals(pos, block.position))
      ).toHaveLength(1)
    })
  })

  it("should create proper blocks by first block position", () => {
    const t = new Tetrimino(
      TetriminoKind.Linear,
      getPositionByFirstBlock(
        new Position(3, 0),
        TetriminoKind.Linear,
        Direction.Left
      ),
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
        expectedBlocksPos.filter((pos) => positionEquals(pos, block.position))
          .length
      ).toBe(1)
    })
  })

  it("should have correct tryMove() behavior", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )
    const p = _.cloneDeep(t.position)
    const b = _.cloneDeep(t.blocks)

    // Move down.
    expect(t.tryMove(MoveDirection.Down, () => false)).toBe(true)
    expect(positionEquals(t.position, new Position(p.x, p.y + 1))).toBe(true)
    // Make sure all blocks are in their position.
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        positionEquals(
          blk.position,
          new Position(block.position.x, block.position.y + 1)
        )
      ).toBe(true)
    })
    // Move right.
    expect(t.tryMove(MoveDirection.Right, () => false)).toBe(true)
    expect(positionEquals(t.position, new Position(p.x + 1, p.y + 1))).toBe(
      true
    )
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        positionEquals(
          blk.position,
          new Position(block.position.x + 1, block.position.y + 1)
        )
      ).toBe(true)
    })
    // This moving attempt should fail. It's position should be preserved.
    expect(t.tryMove(MoveDirection.Right, () => true)).toBe(false)
    expect(positionEquals(t.position, new Position(p.x + 1, p.y + 1))).toBe(
      true
    )
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(
        positionEquals(
          blk.position,
          new Position(block.position.x + 1, block.position.y + 1)
        )
      ).toBe(true)
    })
  })

  it("should have correct tryRotate() behavior", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock(
        new Position(5, 5),
        TetriminoKind.Cubic,
        Direction.Up
      ),
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
      expect(positionEquals(origBlks[0].position, block.position)).toBe(true)
    })
    // This should not change the state
    expect(t.tryRotate(RotationDirection.Right, () => true)).toBe(false)
    t.blocks.forEach((block) => {
      const origBlks = b.filter((origBlk) => origBlk.id === block.id)
      expect(origBlks).toHaveLength(1)
      expect(positionEquals(origBlks[0].position, block.position)).toBe(true)
    })
  })

  it("should be structured-clone-friendly", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock(
        new Position(5, 5),
        TetriminoKind.Cubic,
        Direction.Up
      ),
      Direction.Up
    )
    const t2 = structuredClone(t)

    expect(t2).not.toHaveProperty("tryMove")
    expect(t2).not.toHaveProperty("tryRotate")
    expect(t2.position).not.toBe(t.position)
    expect(t2.position).toEqual(t.position)
  })

  it("should be repaired by a helper", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock(
        new Position(5, 5),
        TetriminoKind.Cubic,
        Direction.Up
      ),
      Direction.Up
    )
    const t2 = repairBrokenTetriminos([structuredClone(t)])[0]

    expect(t2).toHaveProperty("tryRotate")
    expect(t2).toHaveProperty("tryMove")
  })
})
