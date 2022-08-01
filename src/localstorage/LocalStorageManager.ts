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

import { isBrowser } from "is-in-browser"
import _ from "lodash"

export function store<T = unknown>(key: string, value: T): boolean {
  if (!isBrowser) return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err: unknown) {
    console.warn(err)
    return false
  }
  return true
}

export function retrieve(key: string): unknown {
  if (!isBrowser) return null

  const result = window.localStorage.getItem(key)
  if (!_.isNil(result)) {
    return JSON.parse(result)
  } else {
    return null
  }
}
