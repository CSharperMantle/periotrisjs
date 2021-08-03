import { Block } from "./Block"

class BlockChangedEventArgs {
  public readonly block: Block
  public readonly disappeared: boolean

  public constructor(block: Block, disappeared: boolean) {
    this.block = block
    this.disappeared = disappeared
  }
}

export { BlockChangedEventArgs }
