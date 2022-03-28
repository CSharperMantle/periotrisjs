import type { ISize } from "../../common"

interface IMapCell {
  atomicNumber: number
  filledBy: number
  identifier: number
  position: { X: number; Y: number }
}

type TMapRow = IMapCell[]

interface IMap {
  periodicTable: TMapRow[]
  totalAvailableBlocksCount: number
  playAreaSize: ISize
}

export type { IMapCell, TMapRow, IMap }
