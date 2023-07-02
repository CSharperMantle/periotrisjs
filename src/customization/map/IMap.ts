/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { memoize } from "lodash"

import type { ISize } from "../../common"

export interface IMapCell {
  readonly atomicNumber: number
  readonly filled: boolean
}

export type TMapRow = IMapCell[]

export interface IMap {
  readonly id: string
  readonly map: TMapRow[]
  readonly playAreaSize: ISize
}

export const countFreeBlocks = memoize(
  (map: IMap): number =>
    map.map
      .flat()
      .map((c) => !c.filled)
      .reduce((acc, current) => (current ? acc + 1 : acc), 0),
  (map) => map.id
)
