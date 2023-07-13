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

import { queryPath } from "../queryPath"

describe("queryPath", () => {
  it("should get correct path by ID", () => {
    const routes = [
      {
        path: "/path_2",
        id: 2,
      },
      {
        path: "/path_1",
        id: 1,
      },
    ] as const
    const result = queryPath(routes, 1)
    expect(result).toStrictEqual("/path_1")
  })

  it("should return first match if multiple entries have the same ID", () => {
    const routes = [
      {
        path: "/path_0",
        id: 0,
      },
      {
        path: "/path_1_1",
        id: 1,
      },
      {
        path: "/path_2",
        id: 2,
      },
      {
        path: "/path_1_2",
        id: 1,
      },
    ] as const
    const result = queryPath(routes, 1)
    expect(result).toStrictEqual("/path_1_1")
  })

  it("should handle erroneous inputs gracefully", () => {
    const routes = [
      {
        path: null,
        id: 1,
      },
    ] as const
    expect(queryPath(null, 1)).toStrictEqual("")
    expect(queryPath(undefined, 1)).toStrictEqual("")
    expect(queryPath([], 1)).toStrictEqual("")
    expect(queryPath(routes, 1)).toStrictEqual("")
  })
})
