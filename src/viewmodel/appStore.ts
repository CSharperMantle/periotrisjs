import { configureStore } from "@reduxjs/toolkit"

import { blocksGridReducer } from "../components/blocksGridSlice"
import { gameControlBackdropReducer } from "../components/gameControlBackdropSlice"
import { timerDisplayReducer } from "../components/timerDisplaySlice"

export const appStore = configureStore({
  reducer: {
    blocksGrid: blocksGridReducer,
    gameControlBackdrop: gameControlBackdropReducer,
    timerDisplay: timerDisplayReducer,
  },
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch
