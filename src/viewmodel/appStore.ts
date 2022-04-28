import { configureStore, combineReducers } from "@reduxjs/toolkit"

import { blocksGridReducer } from "../components/blocksGrid/blocksGridSlice"
import { gameControlBackdropReducer } from "../components/gameControlBackdrop/gameControlBackdropSlice"
import { timerDisplayReducer } from "../components/timerDisplay/timerDisplaySlice"

export const appStore = configureStore({
  reducer: {
    game: combineReducers({
      blocksGrid: blocksGridReducer,
      gameControlBackdrop: gameControlBackdropReducer,
      timerDisplay: timerDisplayReducer,
    }),
  },
})

export type AppState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch
