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

import { Block } from "../Block"
import { Direction } from "../Direction"
import {
  createOffsetedBlocks,
  getInitialPositionByKind,
  mapAtomicNumberInto,
} from "../TetriminoHelper"
import { TetriminoKind } from "../TetriminoKind"

const PlayAreaWidth = 18

describe("createOffsetedBlocks", () => {
  it("should have correct behavior", () => {
    const blks = createOffsetedBlocks(TetriminoKind.Cubic, [0, 0], Direction.Up)

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
      createOffsetedBlocks(TetriminoKind.Free, [0, 0], Direction.Down)
    }).toThrowError(new RangeError("getBlocksMask: invalid kind 7"))
    expect(() => {
      createOffsetedBlocks(TetriminoKind.Reserved, [0, 0], Direction.Down)
    }).toThrowError(new RangeError("getBlocksMask: invalid kind 8"))
  })
})

describe("mapAtomicNumberForNewBlocks", () => {
  it("should have correct behavior", () => {
    const oldBlocks = [
      new Block(TetriminoKind.Cubic, [0, 0], 0, 0),
      new Block(TetriminoKind.Cubic, [1, 0], 1, 1),
    ]
    const newBlocks = [
      new Block(TetriminoKind.Cubic, [1, 0], -1, 0),
      new Block(TetriminoKind.Cubic, [2, 0], -1, 1),
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
      mapAtomicNumberInto([], [new Block(TetriminoKind.Cubic, [0, 0], 0, 0)])
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 0!==1"))
    expect(() => {
      mapAtomicNumberInto([new Block(TetriminoKind.Cubic, [0, 0], 0, 0)], [])
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 1!==0"))
    expect(() => {
      mapAtomicNumberInto(
        [new Block(TetriminoKind.Cubic, [0, 0], 0, 0)],
        [
          new Block(TetriminoKind.Cubic, [0, 0], 0, 0),
          new Block(TetriminoKind.Cubic, [0, 0], 0, 0),
        ]
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 1!==2"))
    expect(() => {
      mapAtomicNumberInto(
        [
          new Block(TetriminoKind.Cubic, [0, 0], 0, 0),
          new Block(TetriminoKind.Cubic, [0, 0], 0, 0),
        ],
        [new Block(TetriminoKind.Cubic, [0, 0], 0, 0)]
      )
    }).toThrowError(new Error("mapAtomicNumberInto: length mismatch 2!==1"))
  })
})

describe("getInitialPositionByKind", () => {
  it("should have correct behavior", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(getInitialPositionByKind(TetriminoKind.Cubic, size)).toEqual([
      Math.floor((PlayAreaWidth - 2) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.Linear, size)).toEqual([
      Math.floor((PlayAreaWidth - 4) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.TeeShaped, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.LShapedCis, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.LShapedTrans, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.ZigZagCis, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
    expect(getInitialPositionByKind(TetriminoKind.ZigZagTrans, size)).toEqual([
      Math.floor((PlayAreaWidth - 3) / 2),
      0,
    ])
  })

  it("should handle incorrect arguments gracefully", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(() => {
      getInitialPositionByKind(TetriminoKind.Free, size)
    }).toThrowError(new RangeError("getInitialPositionByKind: invalid kind 7"))
    expect(() => {
      getInitialPositionByKind(TetriminoKind.Reserved, size)
    }).toThrowError(new RangeError("getInitialPositionByKind: invalid kind 8"))
  })
})
