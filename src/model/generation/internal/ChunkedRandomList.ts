import _ from "lodash"

class ChunkedRandomListEntry<T> {
  private data: T[]

  public constructor(data: T[]) {
    this.data = data
  }

  public pop(): T {
    if (this.data.length === 0) {
      throw new Error("Cannot pop from empty list.")
    }
    const index = _.random(0, this.data.length - 1)
    return this.data.splice(index, 1)[0]
  }

  public isEmpty(): boolean {
    return this.data.length === 0
  }
}

class ChunkedRandomList<T> {
  private entries: ChunkedRandomListEntry<T>[] = []

  public constructor(entries: ChunkedRandomListEntry<T>[]) {
    this.entries = _.shuffle(entries)
  }

  public pop(): T {
    if (this.entries.length === 0) {
      throw new Error("Cannot pop from empty list.")
    }
    const entry = this.entries[this.entries.length - 1]
    if (entry === undefined) {
      throw new Error("Cannot pop from empty list.")
    }
    const element = entry.pop()
    if (entry.isEmpty()) {
      this.entries.pop()
    }
    return element
  }

  public hasRemaining(): boolean {
    return this.entries.length > 0
  }
}

export { ChunkedRandomList, ChunkedRandomListEntry }
