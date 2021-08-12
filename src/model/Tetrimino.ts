import _ from "lodash"

import { Position } from "../common/Position"
import { Block } from "./Block"
import { Direction, MoveDirection, RotationDirection } from "./Direction"
import {
  createOffsetedBlocks,
  getFirstBlockPositionByPosition,
  getPositionByFirstBlockPosition,
  mapAtomicNumberForNewBlocks,
} from "./generation/GeneratorHelper"
import { TetriminoKind } from "./TetriminoKind"

/**
 * The type for block collision checker.
 *
 * @returns 'false' if no collision found. Otherwise 'true'.
 */
type BlockCollisionChecker = (block: Block) => boolean

class Tetrimino {
  public facingDirection: Direction

  /**
   * The position of the most bottom-right Block.
   */
  public firstBlockPosition: Position

  public kind: TetriminoKind

  public position: Position

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
    collisionChecker: BlockCollisionChecker
  ): boolean {
    let position: Position = this.position
    if (direction === MoveDirection.Down) {
      const row: number = position.Y + 1
      position = new Position(position.X, row)
    } else {
      const delta: number = direction === MoveDirection.Right ? 1 : -1
      const column: number = position.X + delta
      position = new Position(column, position.Y)
    }

    let newBlocks: Block[] = createOffsetedBlocks(
      this.kind,
      position,
      this.facingDirection
    )
    newBlocks = mapAtomicNumberForNewBlocks(this.blocks, newBlocks)
    if (_.some(newBlocks, collisionChecker)) {
      return false
    }

    this.position = position
    this.blocks = newBlocks
    return true
  }

  /**
   * Rotates the Tetrimino instance.
   *
   * @param rotationDirection The direction to rotate.
   * @param collisionChecker The BlockCollisionChecker function to use.
   * @returns 'true' for a successful rotation, otherwise 'false'.
   */
  public tryRotate(
    rotationDirection: RotationDirection,
    collisionChecker: BlockCollisionChecker
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

    for (let i = 0; i < adjustPattern.length; i++) {
      const adjust = adjustPattern[i]
      const newPos: Position = new Position(
        this.position.X + adjust,
        this.position.Y
      )
      let newBlocks: Block[] = createOffsetedBlocks(
        this.kind,
        newPos,
        direction
      )
      if (!_.some(newBlocks, collisionChecker)) {
        newBlocks = mapAtomicNumberForNewBlocks(this.blocks, newBlocks)
        this.facingDirection = direction
        this.position = newPos
        this.blocks = newBlocks
        return true
      }
    }
    return false
  }

  public static createTetriminoByPosition(
    kind: TetriminoKind,
    position: Position,
    facingDirection: Direction
  ): Tetrimino {
    return new Tetrimino(
      kind,
      position,
      getFirstBlockPositionByPosition(position, kind, facingDirection),
      facingDirection
    )
  }

  public static createTetriminoByFirstBlockPosition(
    kind: TetriminoKind,
    firstBlockPos: Position,
    facingDirection: Direction
  ): Tetrimino {
    return new Tetrimino(
      kind,
      getPositionByFirstBlockPosition(firstBlockPos, kind, facingDirection),
      firstBlockPos,
      facingDirection
    )
  }

  /**
   * The constructor. Not for direct use.
   * Use Tetrimino.createTetriminoByFirstBlockPosition()
   * and Tetrimino.createTetriminoByPosition() instead.
   */
  protected constructor(
    kind: TetriminoKind,
    position: Position,
    firstBlockPos: Position,
    facingDirection: Direction
  ) {
    this.position = position
    this.kind = kind
    this.firstBlockPosition = firstBlockPos
    this.facingDirection = facingDirection
    this.blocks = createOffsetedBlocks(kind, position, facingDirection)
  }
}

export { Tetrimino, BlockCollisionChecker }
