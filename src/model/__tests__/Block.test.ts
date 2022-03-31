import { Position } from "../../common"
import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"

function structuredClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

describe("Block", () => {
  it("should be initialized with correct props", () => {
    const b = new Block(TetriminoKind.AvailableToFill, new Position(1, 2), 3, 4)

    expect(b.filledBy).toBe(TetriminoKind.AvailableToFill)
    expect(b.atomicNumber).toBe(3)
    expect(b.id).toBe(4)
  })

  it("should be structured-clone-friendly", () => {
    const b = new Block(TetriminoKind.AvailableToFill, new Position(1, 2), 3, 4)
    const b2 = structuredClone(b)

    expect(b2.filledBy).toBe(TetriminoKind.AvailableToFill)
    expect(b2.atomicNumber).toBe(3)
    expect(b2.id).toBe(4)
    expect(b2.position).not.toBe(b.position)
    expect(b2.position).toEqual(new Position(1, 2))
  })
})
