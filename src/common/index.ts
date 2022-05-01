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
}

export type { ISize }
