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

import { flushed } from "./flushed"
import {
  DefaultBorderThickness,
  DefaultGameUpdateIntervalMilliseconds,
  HistoryLocalStorageKey,
  SettingsLocalStorageKey,
  StopwatchUpdateIntervalMilliseconds,
} from "./PeriotrisConst"
import { Position, positionEquals } from "./Position"
import { rearrange } from "./rearrange"
import { waitForEvent } from "./waitForEvent"
import { isNil } from "./isNil"

import type { ISize } from "./ISize"

export {
  DefaultGameUpdateIntervalMilliseconds,
  StopwatchUpdateIntervalMilliseconds,
  HistoryLocalStorageKey,
  SettingsLocalStorageKey,
  DefaultBorderThickness,
  Position,
  positionEquals,
  rearrange,
  flushed,
  waitForEvent,
  isNil,
}

export type { ISize }
