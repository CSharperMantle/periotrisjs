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

import { filter, head } from "lodash"

export type TRoute = {
  readonly id: number | null
  readonly path: string | null
} | null

export type TRoutes = readonly TRoute[] | null | undefined

export function queryPath(routes: TRoutes, id: number): string {
  return head(filter(routes, (r) => r?.id === id))?.path ?? "#"
}