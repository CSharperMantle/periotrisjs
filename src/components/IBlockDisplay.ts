import type { IBlockSprite } from "../viewmodel"

interface IBlockDisplay extends IBlockSprite {
  hasContent: boolean
  hasBorder: boolean
  symbolColor: string
}

export type { IBlockDisplay }
