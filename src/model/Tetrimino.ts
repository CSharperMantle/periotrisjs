import _ from "lodash"

import { Position } from "../common"
import { Block } from "./Block"
import { Direction, MoveDirection, RotationDirection } from "./Direction"
import {
  createOffsetedBlocks,
  getTransformedCoord,
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
    const origPos = this.position
    let newPos: Position
    if (direction === MoveDirection.Down) {
      const row = origPos.y + 1
      newPos = new Position(origPos.x, row)
    } else {
      const delta = direction === MoveDirection.Right ? 1 : -1
      const column = origPos.x + delta
      newPos = new Position(column, origPos.y)
    }

    const deltaX = newPos.x - origPos.x
    const deltaY = newPos.y - origPos.y

    const newBlocks = _.cloneDeep(this.blocks)
    for (let i = 0, len = newBlocks.length; i < len; i++) {
      const block = newBlocks[i]
      block.position = new Position(
        block.position.x + deltaX,
        block.position.y + deltaY
      )
    }

    if (newBlocks.some(collisionChecker)) {
      return false
    }

    this.position = newPos
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

  public static createTetriminoByPosition(
    kind: TetriminoKind,
    position: Position,
    facingDirection: Direction
  ): Tetrimino {
    return new Tetrimino(
      kind,
      position,
      getTransformedCoord(position, kind, facingDirection, true),
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
      getTransformedCoord(firstBlockPos, kind, facingDirection, false),
      firstBlockPos,
      facingDirection
    )
  }

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

function repairBrokenTetriminos(brokenTetriminos: Tetrimino[]): Tetrimino[] {
  /*
   * HACK: Object's prototype chain will be lost when
   * transferred through messages, thanks to the limitations
   * of Structured Clone. The following code's
   * purpose is to restore the method mapping of the
   * objects.
   */
  const repairedTetriminos: Tetrimino[] = Array.from(
    brokenTetriminos,
    (brokenTetrimino: Tetrimino) => {
      // Fix tetrimino itself
      const repairedTetrimino = Object.create(
        Tetrimino.prototype,
        Object.getOwnPropertyDescriptors(brokenTetrimino)
      ) as Tetrimino

      // Fix its block positions
      const repairedBlocks: Block[] = Array.from(
        repairedTetrimino.blocks,
        (block: Block) => {
          const repairedBlock = Object.create(
            Block.prototype,
            Object.getOwnPropertyDescriptors(block)
          ) as Block
          repairedBlock.position = Object.create(
            Position.prototype,
            Object.getOwnPropertyDescriptors(repairedBlock.position)
          ) as Position
          return repairedBlock
        }
      )
      repairedTetrimino.blocks = repairedBlocks

      // Fix its own positions
      repairedTetrimino.firstBlockPosition = Object.create(
        Position.prototype,
        Object.getOwnPropertyDescriptors(repairedTetrimino.firstBlockPosition)
      ) as Position
      repairedTetrimino.position = Object.create(
        Position.prototype,
        Object.getOwnPropertyDescriptors(repairedTetrimino.position)
      ) as Position

      return repairedTetrimino
    }
  )
  return repairedTetriminos
}

export { Tetrimino, BlockCollisionChecker, repairBrokenTetriminos }
