import { createSlice } from "@reduxjs/toolkit"

import type { PayloadAction } from "@reduxjs/toolkit"

interface ITimerDisplayState {
  elapsedTime: number
  fastestRecord: number
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
    setFastestRecord: (state, action: PayloadAction<number>) => {
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
