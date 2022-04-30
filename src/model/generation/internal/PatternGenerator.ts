import _ from "lodash"

import { Position } from "../../../common"
import { Block } from "../../Block"
import { Direction, RotationDirection } from "../../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import {
  getInitialPositionByKind,
  getPositionByFirstBlock,
} from "../GeneratorHelper"
import { sort } from "./TetriminoSorter"

import type { ISize } from "../../../common"
import type { IMap } from "../../../customization"

function fastRandom(startInc: number, endExc: number): number {
  return startInc + Math.floor(Math.random() * (endExc - startInc))
}

export async function getPlayablePattern(gameMap: IMap): Promise<Tetrimino[]> {
  const template: Block[][] = []

  for (let i = 0; i < gameMap.playAreaSize.height; i++) {
    template[i] = []

    for (let j = 0; j < gameMap.playAreaSize.width; j++) {
      const origElem = gameMap.map[i][j]
      template[i][j] = new Block(
        origElem.filledBy,
        new Position(origElem.position.x, origElem.position.y),
        origElem.atomicNumber,
        0
      )
    }
  }

  const ordered = sort(
    await getPossibleTetriminoPattern(
      template,
      gameMap.totalAvailableBlocksCount
    ),
    gameMap.playAreaSize
  )

  const fixedTetriminos = repairBrokenTetriminos(ordered)

  primeTetriminos(fixedTetriminos, gameMap.playAreaSize)

  return fixedTetriminos
}

async function getPossibleTetriminoPattern(
  template: Block[][],
  totalAvailableBlocksCount: number
): Promise<Tetrimino[]> {
  const occupationMap: TetriminoKind[][] = []
  for (let i = 0; i < template.length; i++) {
    occupationMap[i] = []
    for (let j = 0; j < template[i].length; j++) {
      occupationMap[i][j] = template[i][j].filledBy
    }
  }

  const settledTetriminos: Tetrimino[] = []
  const pendingTetriminoKinds: KindDirectionsPair[][] = []
  let availableBlocksCount = totalAvailableBlocksCount
  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (availableBlocksCount <= 0) {
      return settledTetriminos
    }

    let currentKindDirectionsPairStack: KindDirectionsPair[]
    if (!rewindingRequired) {
      currentKindDirectionsPairStack = createShuffledKindDirectionsPairs()
    } else {
      if (settledTetriminos.length === 0) {
        return settledTetriminos
      }

      const poppedKinds = pendingTetriminoKinds.pop()
      if (_.isNil(poppedKinds)) {
        throw new Error("poppedKinds")
      }
      currentKindDirectionsPairStack = poppedKinds

      const lastTetrimino = settledTetriminos.pop()
      if (_.isNil(lastTetrimino)) {
        throw new Error("lastTetrimino")
      }

      for (let i = 0, len = lastTetrimino.blocks.length; i < len; i++) {
        const block = lastTetrimino.blocks[i]
        occupationMap[block.position.y][block.position.x] =
          TetriminoKind.AvailableToFill
      }
      availableBlocksCount += lastTetrimino.blocks.length
    }

    const firstBlockCoord = getFirstAvailableBlockCoord(occupationMap)

    let solutionFound = false
    while (currentKindDirectionsPairStack.length > 0) {
      const currentPair = currentKindDirectionsPairStack.pop()
      if (_.isNil(currentPair)) {
        throw new Error("currentPair")
      }
      while (currentPair.directions.length > 0) {
        const direction = currentPair.popRandomDirection()
        const tetrimino = new Tetrimino(
          currentPair.kind,
          getPositionByFirstBlock(firstBlockCoord, currentPair.kind, direction),
          direction
        )
        if (
          !tetrimino.blocks.some(
            collisionChecker.bind(undefined, occupationMap)
          )
        ) {
          settledTetriminos.push(tetrimino)
          pendingTetriminoKinds.push(currentKindDirectionsPairStack)
          for (let i = 0, len = tetrimino.blocks.length; i < len; i++) {
            const oldBlock = tetrimino.blocks[i]
            const newBlock = {
              ...oldBlock,
              atomicNumber:
                template[oldBlock.position.y][oldBlock.position.x].atomicNumber,
            }
            occupationMap[newBlock.position.y][newBlock.position.x] =
              newBlock.filledBy
            tetrimino.blocks[i] = newBlock
          }
          availableBlocksCount -= tetrimino.blocks.length
          solutionFound = true
          break
        }
      }
      if (solutionFound) {
        break
      }
    }
    rewindingRequired = !solutionFound
  }
}

function createShuffledKindDirectionsPairs(): KindDirectionsPair[] {
  return _.shuffle([
    new KindDirectionsPair(TetriminoKind.Cubic),
    new KindDirectionsPair(TetriminoKind.LShapedCis),
    new KindDirectionsPair(TetriminoKind.LShapedTrans),
    new KindDirectionsPair(TetriminoKind.Linear),
    new KindDirectionsPair(TetriminoKind.TeeShaped),
    new KindDirectionsPair(TetriminoKind.ZigZagCis),
    new KindDirectionsPair(TetriminoKind.ZigZagTrans),
  ])
}

function collisionChecker(
  occupationMap: TetriminoKind[][],
  block: Block
): boolean {
  const nRow = block.position.y
  const nCol = block.position.x
  if (
    nCol < 0 ||
    nCol >= occupationMap[0].length ||
    nRow < 0 ||
    nRow >= occupationMap.length
  ) {
    return true
  }
  return occupationMap[nRow][nCol] !== TetriminoKind.AvailableToFill
}

function getFirstAvailableBlockCoord(
  occupationMap: TetriminoKind[][]
): Position {
  for (let nRow = occupationMap.length - 1; nRow >= 0; nRow--) {
    const col = occupationMap[nRow]
    for (let nCol = col.length - 1; nCol >= 0; nCol--) {
      if (col[nCol] === TetriminoKind.AvailableToFill) {
        return new Position(nCol, nRow)
      }
    }
  }
  return new Position(-1, -1)
}

class KindDirectionsPair {
  public readonly kind: TetriminoKind
  public readonly directions: Direction[]

  public constructor(kind: TetriminoKind) {
    this.kind = kind
    this.directions = [
      Direction.Up,
      Direction.Down,
      Direction.Left,
      Direction.Right,
    ]
  }

  public popRandomDirection(): Direction {
    const index = fastRandom(0, this.directions.length)
    return this.directions.splice(index)[0]
  }
}

/**
 * "Prime" the tetriminos, that is, move them to the top center of play
 * area and rotate them randomly for initial direction.
 *
 * @param tetriminos The tetriminos to prime.
 * @param playAreaSize Size of play area.
 */
function primeTetriminos(tetriminos: Tetrimino[], playAreaSize: ISize) {
  // Move to initial position and rotate randomly
  for (let i = 0, len = tetriminos.length; i < len; i++) {
    const tetrimino = tetriminos[i]
    const originalPos = tetrimino.position
    const newPos = getInitialPositionByKind(tetrimino.kind, playAreaSize)
    const deltaX = newPos.x - originalPos.x
    const deltaY = newPos.y - originalPos.y
    const newBlocks: Block[] = Array.from(tetrimino.blocks, (block: Block) => {
      return new Block(
        block.filledBy,
        new Position(block.position.x + deltaX, block.position.y + deltaY),
        block.atomicNumber,
        block.id
      )
    })

    tetrimino.blocks = newBlocks
    tetrimino.position = newPos

    const rotationCount = fastRandom(
      0,
      Math.floor(Object.keys(Direction).length / 2) + 1
    )
    for (let i = 0; i < rotationCount; i++) {
      tetrimino.tryRotate(RotationDirection.Right, () => false)
    }
  }
}
