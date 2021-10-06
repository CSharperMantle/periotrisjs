import { Position } from "../../common"
import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"

describe("Block", () => {
  it("should be initialized with correct props", () => {
    const b = new Block(TetriminoKind.AvailableToFill, new Position(1, 2), 3, 4)

    expect(b.filledBy).toBe(TetriminoKind.AvailableToFill)
    expect(b.atomicNumber).toBe(3)
    expect(b.id).toBe(4)
  })
})
