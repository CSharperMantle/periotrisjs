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

import { isEqual } from "lodash"

import { Direction } from "../Direction"
import {
  createOffsetBlocks,
  getInitialPosition,
  mapAtomicNumberInto,
} from "../TetriminoHelper"
import { TetriminoKind } from "../TetriminoKind"

const PlayAreaWidth = 18

describe("createOffsetBlocks", () => {
  it("should have correct behavior", () => {
    const blks = createOffsetBlocks(TetriminoKind.Cubic, [0, 0], Direction.Up)

    const expectedPos = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]
    blks.forEach((blk) => {
      expect(
        expectedPos.filter((pos) => isEqual(blk.position, pos))
      ).toHaveLength(1)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      createOffsetBlocks(TetriminoKind.Free, [0, 0], Direction.Down)
    }).toThrowError(new RangeError("getBlocksMask: invalid kind 7"))
    expect(() => {
      createOffsetBlocks(TetriminoKind.Reserved, [0, 0], Direction.Down)
    }).toThrowError(new RangeError("getBlocksMask: invalid kind 8"))
  })
})

describe("mapAtomicNumberInto", () => {
  it("should have correct behavior", () => {
    const oldBlocks = [
      {
        filledBy: TetriminoKind.Cubic,
        position: [0, 0] as const,
        atomicNumber: 0,
        id: 0,
      },
      {
        filledBy: TetriminoKind.Cubic,
        position: [1, 0] as const,
        atomicNumber: 1,
        id: 1,
      },
    ]
    const newBlocks = [
      {
        filledBy: TetriminoKind.Cubic,
        position: [1, 0] as const,
        atomicNumber: null,
        id: 0,
      },
      {
        filledBy: TetriminoKind.Cubic,
        position: [2, 0] as const,
        atomicNumber: null,
        id: 1,
      },
    ]
    mapAtomicNumberInto(oldBlocks, newBlocks)
    newBlocks.forEach((block) => {
      const corrOldBlks = oldBlocks.filter((blk) => blk.id === block.id)
      expect(corrOldBlks).toHaveLength(1)
      expect(block.atomicNumber).toBe(corrOldBlks[0].atomicNumber)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      mapAtomicNumberInto(
        [],
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ]
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 0!==1"))
    expect(() => {
      mapAtomicNumberInto(
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ],
        []
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 1!==0"))
    expect(() => {
      mapAtomicNumberInto(
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ],
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ]
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 1!==2"))
    expect(() => {
      mapAtomicNumberInto(
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ],
        [
          {
            filledBy: TetriminoKind.Cubic,
            position: [0, 0] as const,
            atomicNumber: 0,
            id: 0,
          },
        ]
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 2!==1"))
  })
})

describe("getInitialPosition", () => {
  it("should have correct behavior", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(getInitialPosition(TetriminoKind.Cubic, size)).toEqual([
      Math.floor((PlayAreaWidth - 2) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.Linear, size)).toEqual([
      Math.floor((PlayAreaWidth - 4) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.TeeShaped, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.LShapedCis, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.LShapedTrans, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.ZigZagCis, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPosition(TetriminoKind.ZigZagTrans, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
  })

  it("should handle incorrect arguments gracefully", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(() => {
      getInitialPosition(TetriminoKind.Free, size)
    }).toThrowError(new RangeError("getInitialPosition: invalid kind 7"))
    expect(() => {
      getInitialPosition(TetriminoKind.Reserved, size)
    }).toThrowError(new RangeError("getInitialPosition: invalid kind 8"))
  })
})
