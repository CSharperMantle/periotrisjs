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
    if (node.depending.length === 0) {
      startNodes.push(node)
    }
  })

  const result: TetriminoNode[] = []
  while (startNodes.length !== 0) {
    const n: TetriminoNode = startNodes.pop()
    result.push(n)
    const dependedBy: TetriminoNode[] = _.clone(n.dependedBy)
    dependedBy.forEach((m: TetriminoNode) => {
      _.remove(n.dependedBy, () => m)
      _.remove(m.depending, () => n)
      if (m.depending.length === 0) {
        startNodes.push(m)
      }
    })
  }

  if (
    _.some(
      graph,
      (node: TetriminoNode) =>
        node.dependedBy.length !== 0 || node.depending.length !== 0
    )
  ) {
    throw new RangeError("tetriminos")
  }
  return result
}

export { sort }
