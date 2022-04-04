import { Block } from "./Block"

class BlockChangedEventArgs {
  public constructor(
    public readonly block: Block,
    public readonly disappeared: boolean
  ) {}
}

export { BlockChangedEventArgs }
