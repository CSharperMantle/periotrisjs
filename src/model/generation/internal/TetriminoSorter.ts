import _ from "lodash"
import toposort from "toposort"

import { rearrange } from "../../../common"
import { Tetrimino } from "../../Tetrimino"

import type { ISize } from "../../../common"

function getEdges(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): [number, number][] {
  // Create owners map
  const owners: number[][] = new Array(playAreaSize.height)
  for (let i = 0; i < playAreaSize.height; i++) {
    owners[i] = new Array(playAreaSize.width)
  }
  // Fill in owners map
  for (let i = 0; i < tetriminos.length; i++) {
    const tetrimino = tetriminos[i]
    for (let j = 0; j < tetrimino.blocks.length; j++) {
      const block = tetrimino.blocks[j]
      owners[block.position.y][block.position.x] = i
    }
  }

  const dependencies = tetriminos
    .map((tetrimino, index) => {
      const singleTetriminoDeps: [number, number][] = new Array(4)
      for (let i = 0; i < tetrimino.blocks.length; i++) {
        const block = tetrimino.blocks[i]
        const dependedBlockRow: number = block.position.y + 1
        const dependedBlockCol: number = block.position.x
        const result = tryGetOccupiedTetriminoNode(
          owners,
          dependedBlockRow,
          dependedBlockCol,
          playAreaSize
        )
        if (_.isNil(result) || result === index) {
          // Ignore self-dependency
          continue
        }
        // Found a result
        singleTetriminoDeps.push([result, index])
      }
      return singleTetriminoDeps
    })
    .flat(1)

  return _.uniq(dependencies)
}

function tryGetOccupiedTetriminoNode(
  map: number[][],
  row: number,
  col: number,
  playAreaSize: ISize
): number | null {
  if (
    row < 0 ||
    row >= playAreaSize.height ||
    col < 0 ||
    col >= playAreaSize.width
  ) {
    return null
  }

  const cell = map[row][col]
  if (_.isNil(cell)) {
    return null
  }

  return cell
}

export function sort(
  tetriminos: Tetrimino[],
  playAreaSize: ISize
): Tetrimino[] {
  const edges = getEdges(tetriminos, playAreaSize)
  const sortedIndices = toposort(edges)
  const sortedTetriminos = rearrange(tetriminos, sortedIndices)

  return sortedTetriminos
}
