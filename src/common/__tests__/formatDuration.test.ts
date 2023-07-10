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

import { AutoplaySentinel } from "../AutoplaySentinel"
import { formatDuration } from "../formatDuration"

describe("formatDuration", () => {
  it("should correctly format well-formed durations", () => {
    const data = [
      {
        input: 0,
        expected: "00:00",
      },
      {
        input: 1000,
        expected: "00:01",
      },
      {
        input: 1000 * 60,
        expected: "01:00",
      },
      {
        input: 1000 * 60 * 100,
        expected: "100:00",
      },
    ]
    for (let i = 0; i < data.length; i++) {
      const { input, expected } = data[i]
      expect(formatDuration(input)).toEqual(expected)
    }
  })

  it("should handle ill-formed durations properly", () => {
    const data = [
      {
        input: -100,
        expected: "--:--",
      },
      {
        input: undefined,
        expected: "--:--",
      },
      {
        input: null,
        expected: "--:--",
      },
    ]
    for (let i = 0; i < data.length; i++) {
      const datum = data[i]
      expect(formatDuration(datum.input)).toEqual(datum.expected)
    }
  })

  it("should handle sentinel values properly", () => {
    expect(formatDuration(AutoplaySentinel)).toEqual("AUTOPLAY")
  })
})
