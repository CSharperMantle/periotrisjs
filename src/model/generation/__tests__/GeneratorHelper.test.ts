import _ from "lodash"
import { Position } from "../../../common/Position"
import { Direction } from "../../Direction"
import { TetriminoKind } from "../../TetriminoKind"
import { createOffsetedBlocks } from "../GeneratorHelper"

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

  it("should handle incorrect arguments correctly", () => {
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
  })
})
