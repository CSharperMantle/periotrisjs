import _ from "lodash"

import { Tetrimino } from "../../Tetrimino"
import { createTetriminoDependencyGraph } from "./DependencyBuilder"
import { TetriminoNode } from "./TetriminoNode"

function sort(tetriminos: Tetrimino[]): Tetrimino[] {
  const graph = createTetriminoDependencyGraph(tetriminos)

  const startNodes: TetriminoNode[] = graph.filter((node: TetriminoNode) => {
    return node.depending.size === 0
  })

  const result: TetriminoNode[] = []
  while (startNodes.length !== 0) {
    const n = _.sample(startNodes)
    if (_.isNil(n)) {
      console.warn("sort() null check")
      continue
    }
    _.remove(startNodes, (node: TetriminoNode) => node === n)
    result.push(n)
    const dependedBy = [...n.dependedBy]
    for (let i = 0, len = dependedBy.length; i < len; i++) {
      const m = dependedBy[i]
      n.dependedBy.delete(m)
      m.depending.delete(n)
      if (m.depending.size === 0) {
        startNodes.push(m)
      }
    }
  }

  if (
    graph.some((node: TetriminoNode) => {
      return node.dependedBy.size !== 0 || node.depending.size !== 0
    })
  )
    throw new RangeError("tetriminos")
  return result
}

export { sort }
