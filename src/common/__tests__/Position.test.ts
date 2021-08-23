import { Position } from "../Position"

describe("Position", () => {
  it("should be initialized with correct props", () => {
    const p = new Position(0, 1)

    expect(p.X).toBe(0)
    expect(p.Y).toBe(1)
  })

  it("should be equatable", () => {
    const p1 = new Position(0, 0)
    const p2 = new Position(0, 1)
    const p3 = new Position(0, 0)
    const p4 = new Position(0, 0)

    expect(p1.equals(p1)).toBe(true)

    expect(p1.equals(p1)).toBe(true)
    expect(p1.equals(p1)).toBe(true)

    expect(p1.equals(p3)).toBe(true)
    expect(p1.equals(p4)).toBe(true)
    expect(p3.equals(p4)).toBe(true)

    expect(p3.equals(p1)).toBe(true)

    expect(p1.equals(p2)).toBe(false)
    expect(p2.equals(p1)).toBe(false)
  })
})
