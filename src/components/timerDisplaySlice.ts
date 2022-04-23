import dayjs, { Dayjs } from "dayjs"

import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"

interface ITimerDisplayState {
  elapsedTime: Dayjs
  fastestRecord: Dayjs
  isNewRecord: boolean
}

const timerDisplayInitialState: ITimerDisplayState = {
  elapsedTime: dayjs(0),
  fastestRecord: dayjs(0),
  isNewRecord: false,
}

export const timerDisplaySlice = createSlice({
  name: "timerDisplay",
  initialState: timerDisplayInitialState,
  reducers: {
    setElapsedTime: (state, action: PayloadAction<Dayjs>) => {
      state.elapsedTime = action.payload
    },
    setFastestRecord: (state, action: PayloadAction<Dayjs>) => {
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
