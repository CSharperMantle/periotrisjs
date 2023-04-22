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

import { isNil } from "./isNil"

/**
 * Format the given duration in milliseconds into m...m:ss.
 *
 * When provided duration is nil or negative, "--:--" is returned.
 */
export function formatDuration(ms: number | null | undefined): string {
  if (isNil(ms) || ms < 0) {
    return "--:--"
  }

  const sec = Math.round(ms / 1000)
  const minutes = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0")
  const seconds = (sec % 60).toString().padStart(2, "0")
  return `${minutes}:${seconds}`
}
