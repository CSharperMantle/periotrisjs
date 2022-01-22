import _ from "lodash"

import { PlayAreaHeight, PlayAreaWidth, Position } from "../../common"
import defaultMap from "../../json/DefaultMap.json"
import { Block } from "../Block"
import { Direction, RotationDirection } from "../Direction"
import { repairBrokenTetriminos, Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { getInitialPositionByKind } from "./GeneratorHelper"
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
  const pendingPossibilityStacks: TetriminoPossibilityStack[] = []

  let rewindingRequired = false
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const firstBlockCoord = getFirstAvailableBlockCoord(workspace)
    if (!(firstBlockCoord.x >= 0 && firstBlockCoord.y >= 0)) {
      return settledTetriminos
    }

    let currentPossibilities: TetriminoPossibilityStack
    if (!rewindingRequired) {
      currentPossibilities = new TetriminoPossibilityStack()
    } else {
      if (settledTetriminos.length === 0) {
        return settledTetriminos
      }

      let poppedPossibilities = pendingPossibilityStacks.pop()
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
    while (currentPossibilities.length() > 0) {
      const currentPossibility = currentPossibilities.pop()

      const tetrimino = Tetrimino.createTetriminoByFirstBlockPosition(
        currentPossibility.kind,
        firstBlockCoord,
        currentPossibility.direction
      )

      let willCollide = tetrimino.blocks.some(
        collisionChecker.bind(undefined, workspace)
      )

      if (!willCollide) {
        settledTetriminos.push(tetrimino)
        pendingPossibilityStacks.push(currentPossibilities)
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

const AllDirections: Direction[] = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
]

const AllKinds: TetriminoKind[] = [
  TetriminoKind.Cubic,
  TetriminoKind.LShapedCis,
  TetriminoKind.LShapedTrans,
  TetriminoKind.Linear,
  TetriminoKind.TeeShaped,
  TetriminoKind.ZigZagCis,
  TetriminoKind.ZigZagTrans,
]

function fastRandom(startInc: number, endExc: number): number {
  return startInc + Math.floor(Math.random() * (endExc - startInc))
}

class TetriminoPossibility {
  public readonly kind: TetriminoKind
  public readonly direction: Direction

  public constructor(kind: TetriminoKind, direction: Direction) {
    this.kind = kind
    this.direction = direction
  }
}

class TetriminoPossibilityStack {
  public readonly theStack: TetriminoPossibility[]

  public constructor() {
    this.theStack = AllKinds.flatMap((kind) =>
      AllDirections.map(
        (direction) => new TetriminoPossibility(kind, direction)
      )
    )
  }

  public pop(): TetriminoPossibility {
    const index = fastRandom(0, this.theStack.length)
    return this.theStack.splice(index, 1)[0]
  }

  public length(): number {
    return this.theStack.length
  }
}

export { getPlayablePattern }
