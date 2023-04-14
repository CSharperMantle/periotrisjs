/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

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
