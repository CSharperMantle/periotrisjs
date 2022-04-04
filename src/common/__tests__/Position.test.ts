import { Position, positionEquals } from "../Position"

describe("Position", () => {
  it("should be initialized with correct props", () => {
    const p = new Position(0, 1)

    expect(p.x).toBe(0)
    expect(p.y).toBe(1)
  })

  it("should be equatable", () => {
    const p1 = new Position(0, 0)
    const p2 = new Position(0, 1)
    const p3 = new Position(0, 0)
    const p4 = new Position(0, 0)

    expect(positionEquals(p1, p1)).toBe(true)
    expect(positionEquals(p1, p1)).toBe(true)

    expect(positionEquals(p1, p3)).toBe(true)
    expect(positionEquals(p1, p4)).toBe(true)
    expect(positionEquals(p1, p4)).toBe(true)

    expect(positionEquals(p3, p1)).toBe(true)

    expect(positionEquals(p1, p2)).toBe(false)
    expect(positionEquals(p2, p1)).toBe(false)
  })
})
