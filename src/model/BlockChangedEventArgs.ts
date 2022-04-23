import { Block } from "./Block"

export class BlockChangedEventArgs {
  public constructor(
    public readonly block: Block,
    public readonly disappeared: boolean
  ) {}
}
