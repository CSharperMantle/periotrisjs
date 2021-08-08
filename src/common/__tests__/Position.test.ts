import { Position } from "../Position"

describe("Position", () => {
  it("should be initialized with correct props", () => {
    const p = new Position(0, 1)

    expect(p.X).toBe<number>(0)
    expect(p.Y).toBe<number>(1)
  })

  it("should be equatable", () => {
    const p1 = new Position(0, 0)
    const p2 = new Position(0, 1)
    const p3 = new Position(0, 0)

    expect(p1.equals(p2)).toBe<boolean>(false)
    expect(p1.equals(p3)).toBe<boolean>(true)
    expect(p2.equals(p3)).toBe<boolean>(false)

    expect(p1.equals(p1)).toBe<boolean>(true)
  })
})
