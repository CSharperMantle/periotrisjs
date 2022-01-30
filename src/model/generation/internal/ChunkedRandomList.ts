import _ from "lodash"

function nativeRandom(minInclusive: number, maxExclusive: number): number {
  return (
    minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive))
  )
}

function popRandomFromArray<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error("Cannot pop from empty array.")
  }
  const index = nativeRandom(0, array.length)
  return array.splice(index)[0]
}

class ChunkedRandomList<T> {
  private chunks: T[][] = []
  private chunkIndices: number[] = []
  private cursor: number = -1

  public constructor(entries: T[][]) {
    this.chunks = entries
    this.chunkIndices = _.range(0, entries.length)
    this.cursor = nativeRandom(0, this.chunkIndices.length)
  }

  public pop(): T {
    if (this.chunkIndices.length === 0) {
      throw new Error("Cannot pop from empty list.")
    }

    const chunkIndex = this.chunkIndices[this.cursor]
    const chunk = this.chunks[chunkIndex]
    const element = popRandomFromArray(chunk)

    if (chunk.length === 0) {
      this.chunkIndices.splice(this.cursor, 1)
      this.cursor = nativeRandom(0, this.chunkIndices.length)
    }

    return element
  }

  public hasRemaining(): boolean {
    return this.chunkIndices.length > 0
  }
}

export { ChunkedRandomList }
