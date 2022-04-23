import { Position } from "../common"
import { Block } from "./Block"
import { Direction, MoveDirection, RotationDirection } from "./Direction"
import {
  createOffsetedBlocks,
  mapAtomicNumberForNewBlocks,
} from "./generation/GeneratorHelper"
import { TetriminoKind } from "./TetriminoKind"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { getPositionByFirstBlock } from "./generation/GeneratorHelper"

/**
 * The type for block collision checker.
 *
 * @returns 'false' if no collision found. Otherwise 'true'.
 */
export type TBlockCollisionChecker = (block: Block) => boolean

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
    collisionChecker: TBlockCollisionChecker
  ): boolean {
    let deltaX = 0
    let deltaY = 0
    if (direction === MoveDirection.Down) {
      deltaY = 1
    } else {
      deltaX = direction === MoveDirection.Right ? 1 : -1
    }

    const newBlocks = this.blocks.map((b) => {
      return {
        filledBy: b.filledBy,
        position: new Position(b.position.x + deltaX, b.position.y + deltaY),
        atomicNumber: b.atomicNumber,
        id: b.id,
      }
    })

    if (newBlocks.some(collisionChecker)) {
      return false
    }

    this.position = new Position(
      this.position.x + deltaX,
      this.position.y + deltaY
    )
    this.blocks = newBlocks
    return true
  }

  /**
   * Rotates the Tetrimino instance.
   *
   * @param rotationDirection The direction to rotate.
   * @param collisionChecker The BlockCollisionChecker function to use.
   * @returns `true` for a successful rotation, otherwise 'false'.
   */
  public tryRotate(
    rotationDirection: RotationDirection,
    collisionChecker: TBlockCollisionChecker
  ): boolean {
    const count: number = Object.keys(Direction).length / 2
    const delta: number = rotationDirection === RotationDirection.Right ? 1 : -1
    let direction = this.facingDirection + delta
    if (direction < 0) {
      direction += count
    }
    if (direction >= count) {
      direction %= count
    }
    const adjustPattern: number[] =
      this.kind === TetriminoKind.Linear ? [0, 1, -1, 2, -2] : [0, 1, -1]

    for (let i = 0, len = adjustPattern.length; i < len; i++) {
      const adjust = adjustPattern[i]
      const newPos: Position = new Position(
        this.position.x + adjust,
        this.position.y
      )
      let newBlocks: Block[] = createOffsetedBlocks(
        this.kind,
        newPos,
        direction
      )
      if (!newBlocks.some(collisionChecker)) {
        newBlocks = mapAtomicNumberForNewBlocks(this.blocks, newBlocks)
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
   * @see {@link getPositionByFirstBlock}
   *
   * @param kind The kind of tetrimino to create.
   * @param position The position of the tetrimino.
   * @param facingDirection The direction the tetrimino is facing.
   */
  public constructor(
    public kind: TetriminoKind,
    public position: Position,
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
  const repairedTetriminos = brokenTetriminos.map(
    (brokenTetrimino) =>
      Object.create(
        Tetrimino.prototype,
        Object.getOwnPropertyDescriptors(brokenTetrimino)
      ) as Tetrimino
  )
  return repairedTetriminos
}
