import _ from "lodash"

import { Block } from "../Block"
import { Tetrimino } from "../Tetrimino"
import { TetriminoKind } from "../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"
import { TetriminoNode } from "./TetriminoNode"

function createTetriminoDependencyGraph(
  tetriminos: Tetrimino[],
  playAreaWidth: number,
  playAreaHeight: number
): TetriminoNode[] {
  const tetriminoNodes: TetriminoNode[] = []
  const memoizedMap: MemoizedBlock[][] = []
  for (let i = 0; i < playAreaHeight; i++) {
    memoizedMap[i] = []
  }

  tetriminos.forEach((tetrimino: Tetrimino) => {
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
      memoizedMap[block.position.Y][block.position.X] = block
    })

    tetriminoNodes.push(tetriminoNode)
  })

  tetriminoNodes.forEach((tetriminoNode: TetriminoNode) => {
    tetriminoNode.memoizedBlocks.forEach((block: MemoizedBlock) => {
      const dependedBlockRow: number = block.position.Y + 1
      const dependedBlockCol: number = block.position.X
      const {
        isSuccessful,
        result,
      }: {
        isSuccessful: boolean
        result: TetriminoNode
      } = tryGetOccupiedTetriminoNode(
        memoizedMap,
        dependedBlockRow,
        dependedBlockCol,
        playAreaWidth,
        playAreaHeight
      )
      if (!isSuccessful || result === tetriminoNode) {
        return
      }
      result.dependedBy.push(tetriminoNode)
      tetriminoNode.depending.push(result)
    })
  })
  return tetriminoNodes
}

function getMemoizedBlocksForTetriminoNode(
  node: TetriminoNode,
  tetrimino: Tetrimino
): MemoizedBlock[] {
  const memoizedBlocks: MemoizedBlock[] = []
  tetrimino.blocks.forEach((block: Block) => {
    memoizedBlocks.push(
      new MemoizedBlock(
        block.filledBy,
        block.position,
        node,
        block.atomicNumber,
        block.id
      )
    )
  })
  return memoizedBlocks
}

function tryGetOccupiedTetriminoNode(
  map: MemoizedBlock[][],
  row: number,
  col: number,
  playAreaWidth: number,
  playAreaHeight: number
): { isSuccessful: boolean; result: TetriminoNode } {
  if (row < 0 || row >= playAreaHeight || col < 0 || col >= playAreaWidth) {
    return { isSuccessful: false, result: null }
  }

  const cell: MemoizedBlock = map[row][col]
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
