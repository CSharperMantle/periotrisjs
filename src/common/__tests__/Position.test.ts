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
