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

import { Position, positionEquals } from "../../common"
import { Block } from "../Block"
import { Direction } from "../Direction"
import {
  createOffsetedBlocks,
  getInitialPositionByKind,
  mapAtomicNumberForNewBlocks,
} from "../TetriminoHelper"
import { TetriminoKind } from "../TetriminoKind"

const PlayAreaWidth = 18

describe("createOffsetedBlocks", () => {
  it("should have correct behavior", () => {
    const blks = createOffsetedBlocks(
      TetriminoKind.Cubic,
      new Position(0, 0),
      Direction.Up
    )

    const expectedPos = [
      new Position(0, 0),
      new Position(0, 1),
      new Position(1, 0),
      new Position(1, 1),
    ]
    blks.forEach((blk) => {
      expect(
        expectedPos.filter((pos) => positionEquals(blk.position, pos))
      ).toHaveLength(1)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      createOffsetedBlocks(
        TetriminoKind.AvailableToFill,
        new Position(0, 0),
        Direction.Down
      )
    }).toThrowError(new Error("Invalid tetrimino kind."))
    expect(() => {
      createOffsetedBlocks(
        TetriminoKind.UnavailableToFill,
        new Position(0, 0),
        Direction.Down
      )
    }).toThrowError(new Error("Invalid tetrimino kind."))
    expect(() => {
      createOffsetedBlocks(9, new Position(0, 0), Direction.Down)
    }).toThrowError(new Error("Invalid tetrimino kind."))
    expect(() => {
      createOffsetedBlocks(TetriminoKind.Cubic, new Position(0, 0), 4)
    }).toThrowError(new Error("Invalid direction."))
  })
})

describe("mapAtomicNumberForNewBlocks", () => {
  it("should have correct behavior", () => {
    const oldBlocks = [
      new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
      new Block(TetriminoKind.Cubic, new Position(1, 0), 1, 1),
    ]
    const newBlocks = [
      new Block(TetriminoKind.Cubic, new Position(1, 0), -1, 0),
      new Block(TetriminoKind.Cubic, new Position(2, 0), -1, 1),
    ]
    const r = mapAtomicNumberForNewBlocks(oldBlocks, newBlocks)
    r.forEach((block) => {
      const corrOldBlks = oldBlocks.filter((blk) => blk.id === block.id)
      const corrNewBlks = newBlocks.filter((blk) => blk.id === block.id)
      expect(corrOldBlks).toHaveLength(1)
      expect(corrNewBlks).toHaveLength(1)
      expect(block.atomicNumber).toBe(corrOldBlks[0].atomicNumber)
      expect(corrNewBlks[0].atomicNumber).toBe(-1)
    })
  })

  it("should handle incorrect arguments gracefully", () => {
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [],
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)],
        []
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)],
        [
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
        ]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
    expect(() => {
      mapAtomicNumberForNewBlocks(
        [
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
          new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0),
        ],
        [new Block(TetriminoKind.Cubic, new Position(0, 0), 0, 0)]
      )
    }).toThrowError(new Error("oldBlocks.length !== newBlocks.length"))
  })
})

describe("getInitialPositionByKind", () => {
  it("should have correct behavior", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.Cubic, size),
        new Position(Math.floor((PlayAreaWidth - 2) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.Linear, size),
        new Position(Math.floor((PlayAreaWidth - 4) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.TeeShaped, size),
        new Position(Math.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.LShapedCis, size),
        new Position(Math.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.LShapedTrans, size),
        new Position(Math.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.ZigZagCis, size),
        new Position(Math.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe(true)
    expect(
      positionEquals(
        getInitialPositionByKind(TetriminoKind.ZigZagTrans, size),
        new Position(Math.floor((PlayAreaWidth - 3) / 2), 0)
      )
    ).toBe(true)
  })

  it("should handle incorrect arguments gracefully", () => {
    const size = { height: NaN, width: PlayAreaWidth }

    expect(() => {
      getInitialPositionByKind(TetriminoKind.AvailableToFill, size)
    }).toThrowError(new Error("Invalid tetrimino kind."))
    expect(() => {
      getInitialPositionByKind(TetriminoKind.UnavailableToFill, size)
    }).toThrowError(new Error("Invalid tetrimino kind."))
    expect(() => {
      getInitialPositionByKind(9, size)
    }).toThrowError(new Error("Invalid tetrimino kind."))
  })
})
