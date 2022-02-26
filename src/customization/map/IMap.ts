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
}

export type { IMapCell, TMapRow, IMap }
