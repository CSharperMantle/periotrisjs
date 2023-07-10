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

import { createSlice } from "@reduxjs/toolkit"

import { AutoplaySentinel } from "../../common"

import type { PayloadAction } from "@reduxjs/toolkit"

interface ITimerDisplayState {
  elapsedTime: number
  fastestRecord: number | typeof AutoplaySentinel | null
  isNewRecord: boolean
}

const timerDisplayInitialState: ITimerDisplayState = {
  elapsedTime: 0,
  fastestRecord: 0,
  isNewRecord: false,
}

export const timerDisplaySlice = createSlice({
  name: "timerDisplay",
  initialState: timerDisplayInitialState,
  reducers: {
    setElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload
    },
    setFastestRecord: (
      state,
      action: PayloadAction<number | typeof AutoplaySentinel | null>
    ) => {
      state.fastestRecord = action.payload
    },
    setIsNewRecord: (state, action: PayloadAction<boolean>) => {
      state.isNewRecord = action.payload
    },
  },
})

export const { setElapsedTime, setFastestRecord, setIsNewRecord } =
  timerDisplaySlice.actions
export const timerDisplayReducer = timerDisplaySlice.reducer
