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
  const dim0len: number = PlayAreaHeight
  const dim1len: number = PlayAreaWidth
  const template: Block[][] = []

  for (let i = 0; i < dim0len; i++) {
    template[i] = []
    for (let j = 0; j < dim1len; j++) {
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

  const tetriminos = sort(
    getPossibleTetriminoPattern(template),
    dim1len,
    dim0len
  )
  tetriminos.forEach((tetrimino: Tetrimino) => {
    const originalPos = tetrimino.position
    const newPos = getInitialPositionByKind(tetrimino.kind)
    const deltaX = newPos.X - originalPos.X
    const deltaY = newPos.Y - originalPos.Y
    const newBlocks: Block[] = []
    tetrimino.blocks.forEach((block: Block) => {
      newBlocks.push(
        new Block(
          block.filledBy,
          new Position(block.position.X + deltaX, block.position.Y + deltaY),
          block.atomicNumber,
          block.id
        )
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
  const workspace = template
  const settledTetrimino: Tetrimino[] = []
  const pendingTetriminoKinds: KindDirectionsPair[][] = []

  function collisionChecker(block: Block): boolean {
    const nRow = block.position.Y
    const nCol = block.position.X
    if (nCol < 0 || nCol >= workspace[0].length || nRow >= workspace.length) {
      return true
    }
    return workspace[nRow][nCol].filledBy !== TetriminoKind.AvailableToFill
  }

  let rewindingRequired = false

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const firstBlockCoord = getFirstAvailableBlockCoord(workspace)
    const firstBlockCol = firstBlockCoord.X
    const firstBlockRow = firstBlockCoord.Y
    if (!(firstBlockCol >= 0 && firstBlockRow >= 0)) {
      return settledTetrimino
    }

    let currentKindDirectionsPairStack: KindDirectionsPair[] | null = null
    if (!rewindingRequired) {
      currentKindDirectionsPairStack = _.shuffle([
        new KindDirectionsPair(TetriminoKind.Cubic),
        new KindDirectionsPair(TetriminoKind.LShapedCis),
        new KindDirectionsPair(TetriminoKind.LShapedTrans),
        new KindDirectionsPair(TetriminoKind.Linear),
        new KindDirectionsPair(TetriminoKind.TeeShaped),
        new KindDirectionsPair(TetriminoKind.ZigZagCis),
        new KindDirectionsPair(TetriminoKind.ZigZagTrans),
      ])
    } else {
      if (settledTetrimino.length === 0) {
        return settledTetrimino
      }
      currentKindDirectionsPairStack = pendingTetriminoKinds.pop()
      const lastTetrimino = settledTetrimino.pop()
      lastTetrimino.blocks.forEach((block: Block) => {
        workspace[block.position.Y][block.position.X].filledBy =
          TetriminoKind.AvailableToFill
      })
    }

    let solutionFound = false
    while (currentKindDirectionsPairStack.length > 0) {
      const currentPair = currentKindDirectionsPairStack.pop()
      while (currentPair.Directions.length > 0) {
        const direction = currentPair.Directions.pop()
        const tetrimino = Tetrimino.createTetriminoByFirstBlockPosition(
          currentPair.Kind,
          firstBlockCoord,
          direction
        )
        if (!_.some(tetrimino.blocks, collisionChecker)) {
          settledTetrimino.push(tetrimino)
          pendingTetriminoKinds.push(currentKindDirectionsPairStack)
          tetrimino.blocks.forEach((block: Block) => {
            block.atomicNumber =
              workspace[block.position.Y][block.position.X].atomicNumber
            workspace[block.position.Y][block.position.X].filledBy =
              block.filledBy
          })
          currentKindDirectionsPairStack = null
          solutionFound = true
          rewindingRequired = false
          break
        }
      }

      if (solutionFound) {
        break
      }
    }

    if (!solutionFound) {
      rewindingRequired = true
    }
  }
}

function getFirstAvailableBlockCoord(blocks: Block[][]): Position {
  let firstBlockRow = -1
  let firstBlockCol = -1
  let firstBlockFound = false
  for (let nRow = blocks.length - 1; nRow >= 0; nRow--) {
    const col: Block[] = blocks[nRow]
    for (let nCol = col.length - 1; nCol >= 0; nCol--) {
      if (col[nCol].filledBy === TetriminoKind.AvailableToFill) {
        firstBlockRow = nRow
        firstBlockCol = nCol
        firstBlockFound = true
        break
      }
    }
    if (firstBlockFound) {
      break
    }
  }
  return new Position(firstBlockCol, firstBlockRow)
}

class KindDirectionsPair {
  public readonly Kind: TetriminoKind
  public readonly Directions: Direction[]

  public constructor(kind: TetriminoKind) {
    this.Kind = kind
    this.Directions = _.shuffle(_.cloneDeep(AllDirections))
  }
}

const AllDirections: Direction[] = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
]

export { getPlayablePattern }
