import type { IBlockSprite } from "../../viewmodel"

export interface IBlockDisplay extends IBlockSprite {
  hasContent: boolean
  hasBorder: boolean
  symbolColor: string
}
