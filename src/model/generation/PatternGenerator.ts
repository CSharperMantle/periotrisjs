import _ from "lodash"
import { PlayAreaHeight, PlayAreaWidth } from "../../common/PeriotrisConst"

import { Position } from "../../common/Position"
import { Block } from "../Block"
import { Direction, RotationDirection } from "../Direction"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { getInitialPositionByKind } from "./GeneratorHelper"
import defaultPeriodicTable from "./defaultPeriodicTable.json"
import { sort } from "./TetriminoSorter"

function getPlayablePattern(): Tetrimino[] {
  const dim0len: number = defaultPeriodicTable.periodicTable.length
  const dim1len: number = defaultPeriodicTable.periodicTable[0].length
  const template: Block[][] = []

  for (let i = 0; i < dim0len; i++) {
    template[i] = []
    for (let j = 0; j < dim1len; j++) {
      const origElem: {
        atomicNumber: number
        filledBy: number
        identifier: number
        position: { X: number; Y: number }
      } = defaultPeriodicTable.periodicTable[i][j]
      template[i][j] = new Block(
        origElem.filledBy,
        new Position(origElem.position.X, origElem.position.Y),
        origElem.atomicNumber,
        0
      )
    }
  }

  const tetriminos: Tetrimino[] = sort(
    getPossibleTetriminoPattern(template),
    dim1len,
    dim0len
  )
  tetriminos.forEach((tetrimino: Tetrimino) => {
    const originalPos: Position = tetrimino.position
    const newPos: Position = getInitialPositionByKind(tetrimino.kind)
    const deltaX: number = newPos.X - originalPos.X
    const deltaY: number = newPos.Y - originalPos.Y
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

    const rotationCount: number = _.random(0, Object.keys(Direction).length / 2)
    for (let i = 0; i < rotationCount; i++) {
      tetrimino.tryRotate(RotationDirection.Right, (_: Block) => false)
    }
  })

  return tetriminos
}

function getPossibleTetriminoPattern(template: Block[][]): Tetrimino[] {
  const workspace: Block[][] = template
  const settledTetrimino: Tetrimino[] = []
  let pendingTetriminoKinds: KindDirectionsPair[][] = []

  function collisionChecker(block: Block): boolean {
    let nRow: number = block.position.Y
    let nCol: number = block.position.X
    if (nCol < 0 || nCol >= workspace[0].length || nRow >= workspace.length) {
      return true
    }
    return workspace[nRow][nCol].filledBy !== TetriminoKind.AvailableToFill
  }

  let rewindingRequired: boolean = false

  while (true) {
    let firstBlockCoord: Position = getFirstAvailableBlockCoord(workspace)
    const firstBlockCol: number = firstBlockCoord.X
    const firstBlockRow: number = firstBlockCoord.Y
    if (!(firstBlockCol >= 0 && firstBlockRow >= 0)) {
      return settledTetrimino
    }

    let currentKindDirectionsPairStack: KindDirectionsPair[] = null
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

    let solutionFound: boolean = false
    while (currentKindDirectionsPairStack.length > 0) {
      const currentPair: KindDirectionsPair = currentKindDirectionsPairStack.pop()
      while (currentPair.Directions.length > 0) {
        const direction: Direction = currentPair.Directions.pop()
        const tetrimino: Tetrimino = Tetrimino.createTetriminoByFirstBlockPosition(
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
  let firstBlockRow: number = -1
  let firstBlockCol: number = -1
  let firstBlockFound: boolean = false
  for (let nRow: number = blocks.length - 1; nRow >= 0; nRow--) {
    const col: Block[] = blocks[nRow]
    for (let nCol: number = col.length - 1; nCol >= 0; nCol--) {
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
