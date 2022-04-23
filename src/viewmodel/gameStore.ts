import { configureStore } from "@reduxjs/toolkit"

import { blocksGridReducer } from "../components/blocksGridSlice"
import { gameControlBackdropReducer } from "../components/gameControlBackdropSlice"
import { timerDisplayReducer } from "../components/timerDisplaySlice"

export const gameStore = configureStore({
  reducer: {
    blocksGrid: blocksGridReducer,
    gameControlBackdrop: gameControlBackdropReducer,
    timerDisplay: timerDisplayReducer,
  },
})

export type GameState = ReturnType<typeof gameStore.getState>
export type GameDispatch = typeof gameStore.dispatch
