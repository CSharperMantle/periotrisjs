import _ from "lodash"
import { Position } from "../../common/Position"
import { Direction, MoveDirection, RotationDirection } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"

describe(Tetrimino, () => {
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

    expect(t.blocks.length).toBe<number>(4)
    t.blocks.forEach((block) => {
      expect(
        _.filter(expectedBlocksPos, (pos) => pos.equals(block.position)).length
      ).toBe<number>(1)
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

    expect(t.blocks.length).toBe<number>(4)
    t.blocks.forEach((block) => {
      expect(
        _.filter(expectedBlocksPos, (pos) => pos.equals(block.position)).length
      ).toBe<number>(1)
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
    expect(t.tryMove(MoveDirection.Down, () => false)).toBe<boolean>(true)
    expect(t.position.equals(new Position(p.X, p.Y + 1))).toBe<boolean>(true)
    // Make sure all blocks are in their position.
    b.forEach((block) => {
      const corrNewBlks = _.filter(t.blocks, (newBlk) => newBlk.id === block.id)
      expect(corrNewBlks.length).toBe<number>(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.X, block.position.Y + 1)
        )
      ).toBe<boolean>(true)
    })
    // Move right.
    expect(t.tryMove(MoveDirection.Right, () => false)).toBe<boolean>(true)
    expect(t.position.equals(new Position(p.X + 1, p.Y + 1))).toBe<boolean>(
      true
    )
    b.forEach((block) => {
      const corrNewBlks = _.filter(t.blocks, (newBlk) => newBlk.id === block.id)
      expect(corrNewBlks.length).toBe<number>(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.X + 1, block.position.Y + 1)
        )
      ).toBe<boolean>(true)
    })
    // This moving attempt should fail. It's position should be preserved.
    expect(t.tryMove(MoveDirection.Right, () => true)).toBe<boolean>(false)
    expect(t.position.equals(new Position(p.X + 1, p.Y + 1))).toBe<boolean>(
      true
    )
    b.forEach((block) => {
      const corrNewBlks = _.filter(t.blocks, (newBlk) => newBlk.id === block.id)
      expect(corrNewBlks.length).toBe<number>(1)
      const blk = corrNewBlks[0]
      expect(
        blk.position.equals(
          new Position(block.position.X + 1, block.position.Y + 1)
        )
      ).toBe<boolean>(true)
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
    expect(t.tryRotate(RotationDirection.Right, () => false)).toBe<boolean>(
      true
    )
    // Rotate back
    expect(t.tryRotate(RotationDirection.Left, () => false)).toBe<boolean>(true)
    t.blocks.forEach((block) => {
      const origBlks = _.filter(b, (origBlk) => origBlk.id === block.id)
      expect(origBlks.length).toBe<number>(1)
      expect(origBlks[0].position.equals(block.position)).toBe<boolean>(true)
    })
    // This should not change the state
    expect(t.tryRotate(RotationDirection.Right, () => true)).toBe<boolean>(
      false
    )
    t.blocks.forEach((block) => {
      const origBlks = _.filter(b, (origBlk) => origBlk.id === block.id)
      expect(origBlks.length).toBe<number>(1)
      expect(origBlks[0].position.equals(block.position)).toBe<boolean>(true)
    })
  })
})
