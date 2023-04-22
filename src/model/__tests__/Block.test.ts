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

import { Block } from "../Block"
import { TetriminoKind } from "../TetriminoKind"

function structuredClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

describe("Block", () => {
  it("should be initialized with correct props", () => {
    const b = new Block(TetriminoKind.AvailableToFill, [1, 2], 3, 4)

    expect(b.filledBy).toBe(TetriminoKind.AvailableToFill)
    expect(b.atomicNumber).toBe(3)
    expect(b.id).toBe(4)
  })

  it("should be structured-clone-friendly", () => {
    const b = new Block(TetriminoKind.AvailableToFill, [1, 2], 3, 4)
    const b2 = structuredClone(b)

    expect(b2.filledBy).toBe(TetriminoKind.AvailableToFill)
    expect(b2.atomicNumber).toBe(3)
    expect(b2.id).toBe(4)
    expect(b2.position).not.toBe(b.position)
    expect(b2.position).toEqual([1, 2])
  })
})
