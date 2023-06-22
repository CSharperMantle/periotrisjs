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

import {
  DefaultBorderThickness,
  DefaultConcurrency,
  DefaultGameUpdateIntervalMilliseconds,
  DefaultShowGridLines,
  DefaultSwipeDeltaX,
  DefaultSwipeDeltaY,
  DefaultSwipeThreshold,
  HistoryLocalStorageKey,
  SettingsLocalStorageKey,
  StopwatchUpdateIntervalMilliseconds,
} from "./PeriotrisConst"
import { flushed } from "./flushed"
import { formatDuration } from "./formatDuration"
import { isNil } from "./isNil"
import { rearrange } from "./rearrange"
import { waitForEvent } from "./waitForEvent"

import type { ISize } from "./ISize"
import type { TPosition } from "./TPosition"

export {
  DefaultShowGridLines,
  DefaultGameUpdateIntervalMilliseconds,
  StopwatchUpdateIntervalMilliseconds,
  HistoryLocalStorageKey,
  SettingsLocalStorageKey,
  DefaultBorderThickness,
  DefaultSwipeThreshold,
  DefaultConcurrency,
  DefaultSwipeDeltaX,
  DefaultSwipeDeltaY,
  rearrange,
  flushed,
  waitForEvent,
  isNil,
  formatDuration,
}
export type { ISize, TPosition }
