import type { ISize } from "../../common"

export interface IMapCell {
  readonly atomicNumber: number
  readonly filledBy: number
  readonly position: { x: number; y: number }
}

export type TMapRow = IMapCell[]

export interface IMap {
  readonly map: TMapRow[]
  readonly totalAvailableBlocksCount: number
  readonly playAreaSize: ISize
}
