// Test cases for rearrange in jest

import { rearrange } from "../rearrange"

describe("rearrange", () => {
  it("should rearrange the given array of objects by the given key", () => {
    const array = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
      { id: 4, name: "d" },
      { id: 5, name: "e" },
    ]
    const indices = [3, 0, 4, 1, 2]
    const result = rearrange(array, indices)
    expect(result).toEqual([
      { id: 4, name: "d" },
      { id: 1, name: "a" },
      { id: 5, name: "e" },
      { id: 2, name: "b" },
      { id: 3, name: "c" },
    ])
  })

  it("should handle empty array and indices", () => {
    const array: unknown[] = []
    const indices: number[] = []
    const result = rearrange(array, indices)
    expect(result).toEqual([])
  })

  it("should handle array and indices of different lengths", () => {
    const array = [1, 2, 3, 4, 5]
    const indices = [3, 0, 4, 1, 2, 6]
    expect(() => rearrange(array, indices)).toThrowError()
  })
})
