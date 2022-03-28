import _ from "lodash"

import { Tetrimino } from "../../Tetrimino"
import { TetriminoKind } from "../../TetriminoKind"
import { MemoizedBlock } from "./MemoizedBlock"
import { TetriminoNode } from "./TetriminoNode"

import type { ISize } from "../../../common"

interface ITryGetOccupiedTetriminoNodeResult {
  isSuccessful: boolean
  result: TetriminoNode | null
}

function createTetriminoDependencyGraph(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): TetriminoNode[] {
  const memoizedMap: MemoizedBlock[][] = []
  for (let i = 0; i < playAreaSize.height; i++) {
    memoizedMap[i] = []
  }

  const tetriminoNodes: TetriminoNode[] = Array.from(
    tetriminos,
    (tetrimino: Tetrimino) => {
      const tetriminoNode: TetriminoNode = new TetriminoNode(
        tetrimino.kind,
        tetrimino.position,
        tetrimino.firstBlockPosition,
        tetrimino.facingDirection,
        tetrimino
      )

      for (let i = 0, len = tetriminoNode.memoizedBlocks.length; i < len; i++) {
        const block = tetriminoNode.memoizedBlocks[i]
        memoizedMap[block.position.y][block.position.x] = block
      }

      return tetriminoNode
    }
  )
  for (let i = 0, len_i = tetriminoNodes.length; i < len_i; i++) {
    const tetriminoNode = tetriminoNodes[i]
    for (
      let j = 0, len_j = tetriminoNode.memoizedBlocks.length;
      j < len_j;
      j++
    ) {
      const block = tetriminoNode.memoizedBlocks[j]
      const dependedBlockRow: number = block.position.y + 1
      const dependedBlockCol: number = block.position.x
      const { isSuccessful, result }: ITryGetOccupiedTetriminoNodeResult =
        tryGetOccupiedTetriminoNode(
          memoizedMap,
          dependedBlockRow,
          dependedBlockCol,
          playAreaSize
        )
      if (!isSuccessful || _.isNil(result) || result === tetriminoNode) {
        continue
      }
      result.dependedBy.add(tetriminoNode)
      tetriminoNode.depending.add(result)
    }
  }
  return tetriminoNodes
}

function tryGetOccupiedTetriminoNode(
  map: MemoizedBlock[][],
  row: number,
  col: number,
  playAreaSize: ISize
): ITryGetOccupiedTetriminoNodeResult {
  if (
    row < 0 ||
    row >= playAreaSize.height ||
    col < 0 ||
    col >= playAreaSize.width
  ) {
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
