import _ from "lodash"

import { PlayAreaHeight, PlayAreaWidth } from "../../common/PeriotrisConst"
import { Position } from "../../common/Position"
import defaultMap from "../../json/DefaultMap.json"
import { Block } from "../Block"
import { Direction, RotationDirection } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { getInitialPositionByKind } from "./GeneratorHelper"
import { sort } from "./TetriminoSorter"

function getPlayablePattern(): Tetrimino[] {
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

  const tetriminos = sort(getPossibleTetriminoPattern(template))

  tetriminos.forEach((tetrimino: Tetrimino) => {
    const originalPos = tetrimino.position
    const newPos = getInitialPositionByKind(tetrimino.kind)
    const deltaX = newPos.X - originalPos.X
    const deltaY = newPos.Y - originalPos.Y
    const newBlocks: Block[] = Array.from(tetrimino.blocks, (block: Block) => {
      return new Block(
        block.filledBy,
        new Position(block.position.X + deltaX, block.position.Y + deltaY),
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
  })

  return tetriminos
}

function getPossibleTetriminoPattern(template: Block[][]): Tetrimino[] {
  const workspace = _.cloneDeep(template)
  const settledTetriminos: Tetrimino[] = []
  const pendingTetriminoKinds: KindDirectionsPair[][] = []

  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const firstBlockCoord = getFirstAvailableBlockCoord(workspace)
    const firstBlockCol = firstBlockCoord.X
    const firstBlockRow = firstBlockCoord.Y
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

      lastTetrimino.blocks.forEach((block: Block) => {
        workspace[block.position.Y][block.position.X].filledBy =
          TetriminoKind.AvailableToFill
      })
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
          tetrimino.blocks.forEach((block: Block) => {
            block.atomicNumber =
              workspace[block.position.Y][block.position.X].atomicNumber
            workspace[block.position.Y][block.position.X].filledBy =
              block.filledBy
          })
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
  const nRow = block.position.Y
  const nCol = block.position.X
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

class KindDirectionsPair {
  public readonly kind: TetriminoKind
  public readonly directions: Direction[]

  public constructor(kind: TetriminoKind) {
    this.kind = kind
    this.directions = _.clone(AllDirections)
  }

  public popRandomDirection(): Direction {
    const index = _.random(0, this.directions.length - 1)
    return this.directions.splice(index)[0]
  }
}

const AllDirections: Direction[] = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
]

export { getPlayablePattern }
