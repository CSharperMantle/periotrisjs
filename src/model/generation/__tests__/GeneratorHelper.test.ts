import _ from "lodash"
import { PlayAreaWidth } from "../../../common/PeriotrisConst"
import { Position } from "../../../common/Position"
import { Block } from "../../Block"
import { Direction } from "../../Direction"
import { TetriminoKind } from "../../TetriminoKind"
import {
  createOffsetedBlocks,
  getInitialPositionByKind,
  mapAtomicNumberForNewBlocks,
} from "../GeneratorHelper"

describe("createOffsetedBlocks", () => {
  it("should have correct behavior", () => {
    const blks = createOffsetedBlocks(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )

    const expectedPos = [
      new Position(0, 0),
      new Position(0, 1),
      new Position(1, 0),
      new Position(1, 1),
    ]
    blks.forEach((blk) => {
      expect(
        _.filter(expectedPos, (pos) => blk.position.equals(pos))
      ).toHaveLength(1)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      createOffsetedBlocks(
        TetriminoKind.AvailableToFill,
        new Position(0, 0),
        Direction.Down
      )
    }).toThrowError(new RangeError("kind"))
    expect(() => {
      createOffsetedBlocks(
        TetriminoKind.UnavailableToFill,
        new Position(0, 0),
        Direction.Down
      )
    }).toThrowError(new RangeError("kind"))
    expect(() => {
      createOffsetedBlocks(9, new Position(0, 0), Direction.Down)
    }).toThrowError(new RangeError("kind"))
    expect(() => {
      createOffsetedBlocks(TetriminoKind.Cubic, new Position(0, 0), 4)
    }).toThrowError(new RangeError("direction"))
  })
})

describe("mapAtomicNumberForNewBlocks", () => {
  it("should have correct behavior", () => {
    const oldBlocks = [
      new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
      new Block(TetriminoKind.Cubic, new Position(1, 0), 1, 1),
    ]
    const newBlocks = [
      new Block(TetriminoKind.Cubic, new Position(1, 0), -1, 0),
      new Block(TetriminoKind.Cubic, new Position(2, 0), -1, 1),
    ]
    const r = mapAtomicNumberForNewBlocks(oldBlocks, newBlocks)
    r.forEach((block) => {
      const corrOldBlks = _.filter(oldBlocks, (blk) => blk.id === block.id)
      const corrNewBlks = _.filter(newBlocks, (blk) => blk.id === block.id)
      expect(corrOldBlks).toHaveLength(1)
      expect(corrNewBlks).toHaveLength(1)
      expect(block.atomicNumber).toBe<number>(corrOldBlks[0].atomicNumber)
      expect(corrNewBlks[0].atomicNumber).toBe<number>(-1)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [],
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)],
        []
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)],
        [
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
        ]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
        ],
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
  })
})

describe("getInitialPositionByKind", () => {
  it("should have correct behavior", () => {
    expect(
      getInitialPositionByKind(TetriminoKind.Cubic).equals(
        new Position(_.floor((PlayAreaWidth - 2) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.Linear).equals(
        new Position(_.floor((PlayAreaWidth - 4) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.TeeShaped).equals(
        new Position(_.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.LShapedCis).equals(
        new Position(_.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.LShapedTrans).equals(
        new Position(_.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.ZigZagCis).equals(
        new Position(_.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe<boolean>(true)
    expect(
      getInitialPositionByKind(TetriminoKind.ZigZagTrans).equals(
        new Position(_.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe<boolean>(true)
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      getInitialPositionByKind(TetriminoKind.AvailableToFill)
    }).toThrowError(new RangeError("kind"))
    expect(() => {
      getInitialPositionByKind(TetriminoKind.UnavailableToFill)
    }).toThrowError(new RangeError("kind"))
    expect(() => {
      getInitialPositionByKind(9)
    }).toThrowError(new RangeError("kind"))
  })
})
