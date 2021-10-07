import _ from "lodash"

import { PlayAreaHeight, PlayAreaWidth } from "../../common"
import { Block } from "../Block"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"
import { TetriminoNode } from "./TetriminoNode"

interface ITryGetOccupiedTetriminoNodeResult {
  isSuccessful: boolean
  result: TetriminoNode | null
}

function createTetriminoDependencyGraph(
  tetriminos: Tetrimino[]
): TetriminoNode[] {
  const memoizedMap: MemoizedBlock[][] = []
  for (let i = 0; i < PlayAreaHeight; i++) {
    memoizedMap[i] = []
  }

  const tetriminoNodes: TetriminoNode[] = Array.from(
    tetriminos,
    (tetrimino: Tetrimino) => {
      const tetriminoNode: TetriminoNode = new TetriminoNode(
        tetrimino.kind,
        tetrimino.position,
        tetrimino.firstBlockPosition,
        tetrimino.facingDirection
      )
      tetriminoNode.memoizedBlocks = getMemoizedBlocksForTetriminoNode(
        tetriminoNode,
        tetrimino
      )
      tetriminoNode.blocks = tetriminoNode.memoizedBlocks

      tetriminoNode.memoizedBlocks.forEach((block: MemoizedBlock) => {
        memoizedMap[block.position.y][block.position.x] = block
      })

      return tetriminoNode
    }
  )

  tetriminoNodes.forEach((tetriminoNode: TetriminoNode) => {
    tetriminoNode.memoizedBlocks.forEach((block: MemoizedBlock) => {
      const dependedBlockRow: number = block.position.y + 1
      const dependedBlockCol: number = block.position.x
      const { isSuccessful, result }: ITryGetOccupiedTetriminoNodeResult =
        tryGetOccupiedTetriminoNode(
          memoizedMap,
          dependedBlockRow,
          dependedBlockCol,
          PlayAreaWidth,
          PlayAreaHeight
        )
      if (!isSuccessful || _.isNil(result) || result === tetriminoNode) {
        return
      }
      result.dependedBy.add(tetriminoNode)
      tetriminoNode.depending.add(result)
    })
  })
  return tetriminoNodes
}

function getMemoizedBlocksForTetriminoNode(
  node: TetriminoNode,
  tetrimino: Tetrimino
): MemoizedBlock[] {
  const memoizedBlocks: MemoizedBlock[] = Array.from(
    tetrimino.blocks,
    (block: Block) => {
      return new MemoizedBlock(
        block.filledBy,
        block.position,
        node,
        block.atomicNumber,
        block.id
      )
    }
  )
  return memoizedBlocks
}

function tryGetOccupiedTetriminoNode(
  map: MemoizedBlock[][],
  row: number,
  col: number,
  playAreaWidth: number,
  playAreaHeight: number
): ITryGetOccupiedTetriminoNodeResult {
  if (row < 0 || row >= playAreaHeight || col < 0 || col >= playAreaWidth) {
    return { isSuccessful: false, result: null }
  }

  const cell = map[row][col]
  if (
    _.isNil(cell) ||
    cell.filledBy === TetriminoKind.AvailableToFill ||
    cell.filledBy === TetriminoKind.UnavailableToFill
  ) {
    return { isSuccessful: false, result: null }
  }

  return { isSuccessful: true, result: cell.owner }
}

export { createTetriminoDependencyGraph }
