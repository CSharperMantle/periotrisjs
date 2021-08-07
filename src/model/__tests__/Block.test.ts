import { Position } from "../../common/Position"
import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"

describe("Block", () => {
  it("should be initialized with correct props", () => {
    const b = new Block(TetriminoKind.AvailableToFill, new Position(1, 2), 3, 4)

    expect(b.filledBy).toBe<number>(TetriminoKind.AvailableToFill)
    expect(b.atomicNumber).toBe<number>(3)
    expect(b.id).toBe<number>(4)
  })
})
