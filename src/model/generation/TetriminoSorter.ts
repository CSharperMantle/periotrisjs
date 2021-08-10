import _ from "lodash"

import { Tetrimino } from "../Tetrimino"
import { createTetriminoDependencyGraph } from "./DependencyBuilder"
import { TetriminoNode } from "./TetriminoNode"

function sort(
  tetriminos: Tetrimino[],
  playAreaWidth: number,
  playAreaHeight: number
): Tetrimino[] {
  const graph: TetriminoNode[] = createTetriminoDependencyGraph(
    tetriminos,
    playAreaWidth,
    playAreaHeight
  )

  const startNodes: TetriminoNode[] = []
  graph.forEach((node: TetriminoNode) => {
    if (node.depending.size === 0) {
      startNodes.push(node)
    }
  })

  const result: TetriminoNode[] = []
  while (startNodes.length !== 0) {
    const n: TetriminoNode = startNodes.pop()!
    result.push(n)
    const dependedBy = [...n.dependedBy]
    dependedBy.forEach((m: TetriminoNode) => {
      n.dependedBy.delete(m)
      m.depending.delete(n)
      if (m.depending.size === 0) {
        startNodes.push(m)
      }
    })
  }

  if (
    _.some(
      graph,
      (node: TetriminoNode) =>
        node.dependedBy.size !== 0 || node.depending.size !== 0
    )
  ) {
    throw new RangeError("tetriminos")
  }
  return result
}

export { sort }
