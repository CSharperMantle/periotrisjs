import _ from "lodash"

import { PlayAreaHeight, PlayAreaWidth, Position } from "../../../common"
import defaultMap from "../../../json/DefaultMap.json"
import { Block } from "../../Block"
import { Direction, RotationDirection } from "../../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { getInitialPositionByKind } from "../GeneratorHelper"
import { ChunkedRandomList } from "./ChunkedRandomList"
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
  fixedTetriminos.forEach((tetrimino: Tetrimino) => {
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
  })

  return fixedTetriminos
}

function getPossibleTetriminoPattern(template: Block[][]): Tetrimino[] {
  // FIXME: Borked
  const workspace = _.cloneDeep(template)
  const settledTetriminos: Tetrimino[] = []
  const pendingPossibilityLists: ChunkedRandomList<TetriminoPossibility>[] = []

  let rewindingRequired = false
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const firstBlockCoord = getFirstAvailableBlockCoord(workspace)
    if (!(firstBlockCoord.x >= 0 && firstBlockCoord.y >= 0)) {
      return settledTetriminos
    }

    let currentPossibilities: ChunkedRandomList<TetriminoPossibility>
    if (!rewindingRequired) {
      currentPossibilities = getNewTetriminoPossibilityList()
    } else {
      if (settledTetriminos.length === 0) {
        return settledTetriminos
      }

      const poppedPossibilities = pendingPossibilityLists.pop()
      if (_.isNil(poppedPossibilities)) {
        throw new Error("poppedPossibilities")
      }
      currentPossibilities = poppedPossibilities

      const lastTetrimino = settledTetriminos.pop()
      if (_.isNil(lastTetrimino)) {
        throw new Error("lastTetrimino")
      }

      lastTetrimino.blocks.forEach((block: Block) => {
        workspace[block.position.y][block.position.x].filledBy =
          TetriminoKind.AvailableToFill
      })
    }

    let solutionFound = false
    while (currentPossibilities.hasRemaining()) {
      const currentPossibility = currentPossibilities.pop()

      const tetrimino = Tetrimino.createTetriminoByFirstBlockPosition(
        currentPossibility.kind,
        firstBlockCoord,
        currentPossibility.direction
      )

      const willCollide = tetrimino.blocks.some(
        collisionChecker.bind(undefined, workspace)
      )

      if (!willCollide) {
        settledTetriminos.push(tetrimino)
        pendingPossibilityLists.push(currentPossibilities)
        tetrimino.blocks.forEach((block: Block) => {
          block.atomicNumber =
            workspace[block.position.y][block.position.x].atomicNumber
          workspace[block.position.y][block.position.x].filledBy =
            block.filledBy
        })
        solutionFound = true
        break
      }
    }
    rewindingRequired = !solutionFound
  }
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

class TetriminoPossibility {
  public readonly kind: TetriminoKind
  public readonly direction: Direction

  public constructor(kind: TetriminoKind, direction: Direction) {
    this.kind = kind
    this.direction = direction
  }
}

function getNewTetriminoPossibilityList(): ChunkedRandomList<TetriminoPossibility> {
  const entries = [
    [
      new TetriminoPossibility(TetriminoKind.Cubic, Direction.Up),
      new TetriminoPossibility(TetriminoKind.Cubic, Direction.Down),
      new TetriminoPossibility(TetriminoKind.Cubic, Direction.Left),
      new TetriminoPossibility(TetriminoKind.Cubic, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.LShapedCis, Direction.Up),
      new TetriminoPossibility(TetriminoKind.LShapedCis, Direction.Down),
      new TetriminoPossibility(TetriminoKind.LShapedCis, Direction.Left),
      new TetriminoPossibility(TetriminoKind.LShapedCis, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.LShapedTrans, Direction.Up),
      new TetriminoPossibility(TetriminoKind.LShapedTrans, Direction.Down),
      new TetriminoPossibility(TetriminoKind.LShapedTrans, Direction.Left),
      new TetriminoPossibility(TetriminoKind.LShapedTrans, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.Linear, Direction.Up),
      new TetriminoPossibility(TetriminoKind.Linear, Direction.Down),
      new TetriminoPossibility(TetriminoKind.Linear, Direction.Left),
      new TetriminoPossibility(TetriminoKind.Linear, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.TeeShaped, Direction.Up),
      new TetriminoPossibility(TetriminoKind.TeeShaped, Direction.Down),
      new TetriminoPossibility(TetriminoKind.TeeShaped, Direction.Left),
      new TetriminoPossibility(TetriminoKind.TeeShaped, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.ZigZagCis, Direction.Up),
      new TetriminoPossibility(TetriminoKind.ZigZagCis, Direction.Down),
      new TetriminoPossibility(TetriminoKind.ZigZagCis, Direction.Left),
      new TetriminoPossibility(TetriminoKind.ZigZagCis, Direction.Right),
    ],
    [
      new TetriminoPossibility(TetriminoKind.ZigZagTrans, Direction.Up),
      new TetriminoPossibility(TetriminoKind.ZigZagTrans, Direction.Down),
      new TetriminoPossibility(TetriminoKind.ZigZagTrans, Direction.Left),
      new TetriminoPossibility(TetriminoKind.ZigZagTrans, Direction.Right),
    ],
  ]
  return new ChunkedRandomList(entries)
}

export { getPlayablePattern }
