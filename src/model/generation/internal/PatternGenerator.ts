import _ from "lodash"

import { PlayAreaHeight, PlayAreaWidth, Position } from "../../../common"
import defaultMap from "../../../json/DefaultMap.json"
import { Block } from "../../Block"
import { Direction, RotationDirection } from "../../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { getInitialPositionByKind } from "../GeneratorHelper"
import { sort } from "./TetriminoSorter"

async function getPlayablePattern(): Promise<Tetrimino[]> {
  const template: Block[][] = []

  for (let i = 0; i < PlayAreaHeight; i++) {
    template[i] = []

    for (let j = 0; j < PlayAreaWidth; j++) {
      const origElem: {
        atomicNumber: number
        filledBy: number
        identifier: number
        position: { X: number; Y: number }
      } = defaultMap.periodicTable[i][j]
      template[i][j] = new Block(
        origElem.filledBy,
        new Position(origElem.position.X, origElem.position.Y),
        origElem.atomicNumber,
        0
      )
    }
  }

  const tetriminos = sort(getPossibleTetriminoPattern(template)) as Tetrimino[]

  const fixedTetriminos = repairBrokenTetriminos(tetriminos)

  for (let i = 0, len = fixedTetriminos.length; i < len; i++) {
    const tetrimino = fixedTetriminos[i]
    const originalPos = tetrimino.position
    const newPos = getInitialPositionByKind(tetrimino.kind)
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

    const rotationCount = _.random(0, Object.keys(Direction).length / 2)
    for (let i = 0; i < rotationCount; i++) {
      tetrimino.tryRotate(RotationDirection.Right, () => false)
    }
  }

  return fixedTetriminos
}

function getPossibleTetriminoPattern(template: Block[][]): Tetrimino[] {
  const workspace = _.cloneDeep(template)
  const settledTetriminos: Tetrimino[] = []
  const pendingTetriminoKinds: KindDirectionsPair[][] = []

  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const firstBlockCoord = getFirstAvailableBlockCoord(workspace)
    const firstBlockCol = firstBlockCoord.x
    const firstBlockRow = firstBlockCoord.y
    if (!(firstBlockCol >= 0 && firstBlockRow >= 0)) {
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
        workspace[block.position.y][block.position.x].filledBy =
          TetriminoKind.AvailableToFill
      }
    }

    let solutionFound = false
    while (!solutionFound && currentKindDirectionsPairStack.length > 0) {
      const currentPair = currentKindDirectionsPairStack.pop()
      if (_.isNil(currentPair)) {
        throw new Error("currentPair")
      }

      while (!solutionFound && currentPair.directions.length > 0) {
        const direction = currentPair.popRandomDirection()
        const tetrimino = Tetrimino.createTetriminoByFirstBlockPosition(
          currentPair.kind,
          firstBlockCoord,
          direction
        )
        if (
          !tetrimino.blocks.some(collisionChecker.bind(undefined, workspace))
        ) {
          settledTetriminos.push(tetrimino)
          pendingTetriminoKinds.push(currentKindDirectionsPairStack)
          for (let i = 0, len = tetrimino.blocks.length; i < len; i++) {
            const block = tetrimino.blocks[i]
            block.atomicNumber =
              workspace[block.position.y][block.position.x].atomicNumber
            workspace[block.position.y][block.position.x].filledBy =
              block.filledBy
          }
          solutionFound = true
          rewindingRequired = false
        }
      }
    }

    if (!solutionFound) {
      rewindingRequired = true
    }
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

function collisionChecker(workspace: Block[][], block: Block): boolean {
  const nRow = block.position.y
  const nCol = block.position.x
  if (nCol < 0 || nCol >= workspace[0].length || nRow >= workspace.length) {
    return true
  }
  return workspace[nRow][nCol].filledBy !== TetriminoKind.AvailableToFill
}

function getFirstAvailableBlockCoord(blocks: Block[][]): Position {
  for (let nRow = blocks.length - 1; nRow >= 0; nRow--) {
    const col: Block[] = blocks[nRow]
    for (let nCol = col.length - 1; nCol >= 0; nCol--) {
      if (col[nCol].filledBy === TetriminoKind.AvailableToFill) {
        return new Position(nCol, nRow)
      }
    }
  }
  return new Position(-1, -1)
}

function fastRandom(startInc: number, endExc: number): number {
  return startInc + Math.floor(Math.random() * (endExc - startInc))
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

export { getPlayablePattern }
