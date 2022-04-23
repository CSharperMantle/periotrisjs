import { configureStore } from "@reduxjs/toolkit"

import { blocksGridReducer } from "../components/blocksGridSlice"

export const gameStore = configureStore({
  reducer: {
    blocksGrid: blocksGridReducer,
  },
})

export type GameState = ReturnType<typeof gameStore.getState>
export type GameDispatch = typeof gameStore.dispatch
