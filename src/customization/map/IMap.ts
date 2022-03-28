import type { ISize } from "../../common"

interface IMapCell {
  readonly atomicNumber: number
  readonly filledBy: number
  readonly identifier: number
  readonly position: { X: number; Y: number }
}

type TMapRow = IMapCell[]

interface IMap {
  readonly periodicTable: TMapRow[]
  readonly totalAvailableBlocksCount: number
  readonly playAreaSize: ISize
}

export type { IMapCell, TMapRow, IMap }
