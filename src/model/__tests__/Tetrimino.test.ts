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

import { cloneDeep, isEqual } from "lodash"

import { Direction, MoveDirection, RotationDirection } from "../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../Tetrimino"
import { getPositionByFirstBlock } from "../TetriminoHelper"
import { TetriminoKind } from "../TetriminoKind"

function structuredClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

describe("Tetrimino", () => {
  it("should create proper blocks by position", () => {
    const t = new Tetrimino(TetriminoKind.Cubic, [0, 0], Direction.Up)

    const expectedBlocksPos = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]

    expect(t.blocks).toHaveLength(4)
    t.blocks.forEach((block) => {
      expect(
        expectedBlocksPos.filter((pos) => isEqual(pos, block.position))
      ).toHaveLength(1)
    })
  })

  it("should create proper blocks by first block position", () => {
    const t = new Tetrimino(
      TetriminoKind.Linear,
      getPositionByFirstBlock([3, 0], TetriminoKind.Linear, Direction.Left),
      Direction.Left
    )

    const expectedBlocksPos = [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ] as const

    expect(t.blocks).toHaveLength(4)
    t.blocks.forEach((block) => {
      expect(
        expectedBlocksPos.filter((pos) => isEqual(pos, block.position))
      ).toHaveLength(1)
    })
  })

  it("should have correct tryMove() behavior", () => {
    const t = new Tetrimino(TetriminoKind.Cubic, [0, 0], Direction.Up)
    const p = cloneDeep(t.position)
    const b = cloneDeep(t.blocks)

    // Move down.
    expect(t.tryMove(MoveDirection.Down, () => false)).toBe(true)
    expect(t.position).toEqual([p[0], p[1] + 1])
    // Make sure all blocks are in their position.
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(blk.position).toEqual([block.position[0], block.position[1] + 1])
    })
    // Move right.
    expect(t.tryMove(MoveDirection.Right, () => false)).toBe(true)
    expect(t.position).toEqual([p[0] + 1, p[1] + 1])
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(blk.position).toEqual([
        block.position[0] + 1,
        block.position[1] + 1,
      ])
    })
    // This moving attempt should fail. It's position should be preserved.
    expect(t.tryMove(MoveDirection.Right, () => true)).toBe(false)
    expect(t.position).toEqual([p[0] + 1, p[1] + 1])
    b.forEach((block) => {
      const corrNewBlks = t.blocks.filter((newBlk) => newBlk.id === block.id)
      expect(corrNewBlks).toHaveLength(1)
      const blk = corrNewBlks[0]
      expect(blk.position).toEqual([
        block.position[0] + 1,
        block.position[1] + 1,
      ])
    })
  })

  it("should have correct tryRotate() behavior", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock([5, 5], TetriminoKind.Cubic, Direction.Up),
      Direction.Up
    )
    const b = cloneDeep(t.blocks)

    // Rotate back and forth
    expect(t.tryRotate(RotationDirection.Right, () => false)).toBe(true)
    // Rotate back
    expect(t.tryRotate(RotationDirection.Left, () => false)).toBe(true)
    t.blocks.forEach((block) => {
      const origBlks = b.filter((origBlk) => origBlk.id === block.id)
      expect(origBlks).toHaveLength(1)
      expect(block.position).toEqual(origBlks[0].position)
    })
    // This should not change the state
    expect(t.tryRotate(RotationDirection.Right, () => true)).toBe(false)
    t.blocks.forEach((block) => {
      const origBlks = b.filter((origBlk) => origBlk.id === block.id)
      expect(origBlks).toHaveLength(1)
      expect(block.position).toEqual(origBlks[0].position)
    })
  })

  it("should be structured-clone-friendly", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock([5, 5], TetriminoKind.Cubic, Direction.Up),
      Direction.Up
    )
    const t2 = structuredClone(t)

    expect(t2).not.toHaveProperty("tryMove")
    expect(t2).not.toHaveProperty("tryRotate")
    expect(t2.position).not.toBe(t.position)
    expect(t2.position).toEqual(t.position)
  })

  it("should be repaired by a helper", () => {
    const t = new Tetrimino(
      TetriminoKind.Cubic,
      getPositionByFirstBlock([5, 5], TetriminoKind.Cubic, Direction.Up),
      Direction.Up
    )
    const t2 = repairBrokenTetriminos([structuredClone(t)])[0]

    expect(t2).toHaveProperty("tryRotate")
    expect(t2).toHaveProperty("tryMove")
  })
})
