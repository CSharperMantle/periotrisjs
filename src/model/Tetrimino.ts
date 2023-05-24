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

import { Block } from "./Block"
import { Direction, MoveDirection, RotationDirection } from "./Direction"
import { createOffsetedBlocks, mapAtomicNumberInto } from "./TetriminoHelper"
import { TetriminoKind } from "./TetriminoKind"

import type { TPosition } from "../common"

/**
 * The type for block collision checker.
 *
 * @returns 'false' if no collision found. Otherwise 'true'.
 */
export type TCollisionChecker = (block: Block) => boolean

/**
 * The tetrimino.
 */
export class Tetrimino {
  public blocks: Block[]

  /**
   * Moves the Tetrimino instance.
   *
   * @param direction The direction to move.
   * @param collisionChecker The BlockCollisionChecker function to use.
   * @returns 'true' for a successful move, otherwise 'false'.
   */
  public tryMove(
    direction: MoveDirection,
    collisionChecker: TCollisionChecker
  ): boolean {
    const deltaY = direction === MoveDirection.Down ? 1 : 0
    const deltaX =
      (direction === MoveDirection.Down ? 0 : 1) *
      (direction === MoveDirection.Right ? 1 : -1)

    const newBlocks = this.blocks.map((b) => ({
      ...b,
      position: [b.position[0] + deltaX, b.position[1] + deltaY] as const,
    }))

    if (newBlocks.some(collisionChecker)) {
      return false
    }

    this.position = [this.position[0] + deltaX, this.position[1] + deltaY]
    this.blocks = newBlocks
    return true
  }

  /**
   * Rotates the Tetrimino instance.
   *
   * Rotation occurs according to the Super Rotational System.
   *
   * @param rotationDirection The direction to rotate.
   * @param collisionChecker The BlockCollisionChecker function to use.
   * @returns `true` for a successful rotation, otherwise 'false'.
   */
  public tryRotate(
    rotationDirection: RotationDirection,
    collisionChecker: TCollisionChecker
  ): boolean {
    // Find the final direction
    const count = Object.keys(Direction).length / 2
    const delta = rotationDirection === RotationDirection.Right ? 1 : -1
    const direction = (this.facingDirection + delta + count) % count

    const adjustPattern =
      this.kind === TetriminoKind.Linear ? [0, 1, -1, 2, -2] : [0, 1, -1]

    // Wall kicking
    for (let i = 0, len = adjustPattern.length; i < len; i++) {
      const newPos = [
        this.position[0] + adjustPattern[i],
        this.position[1],
      ] as const
      const newBlocks = createOffsetedBlocks(this.kind, newPos, direction)
      if (!newBlocks.some(collisionChecker)) {
        mapAtomicNumberInto(this.blocks, newBlocks)
        this.facingDirection = direction
        this.position = newPos
        this.blocks = newBlocks
        return true
      }
    }

    return false
  }

  /**
   * Creates a new tetrimino.
   *
   * @param kind The kind of tetrimino to create.
   * @param position The position of the tetrimino.
   * @param facingDirection The direction the tetrimino is facing.
   */
  public constructor(
    public kind: TetriminoKind,
    public position: TPosition,
    public facingDirection: Direction
  ) {
    this.blocks = createOffsetedBlocks(kind, position, facingDirection)
  }
}

/**
 * Repair the prototype for a plainly-created tetrimino.
 *
 * Object's prototype chain will be lost when transferred through
 * messages, thanks to the limitations of Structured Clone. This
 * method's purpose is to restore the method mapping of the objects.
 */
export function repairBrokenTetriminos(
  brokenTetriminos: Tetrimino[]
): Tetrimino[] {
  return brokenTetriminos.map((t) =>
    Object.create(Tetrimino.prototype, Object.getOwnPropertyDescriptors(t))
  )
}
