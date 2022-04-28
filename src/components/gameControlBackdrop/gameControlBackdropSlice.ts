import { createSlice } from "@reduxjs/toolkit"

import { GameState } from "../../model"

import type { PayloadAction } from "@reduxjs/toolkit"

interface IGameControlBackdropState {
  gameState: GameState
}

const gameControlBackdropInitialState: IGameControlBackdropState = {
  gameState: GameState.NotStarted,
}

export const gameControlBackdropSlice = createSlice({
  name: "gameControlBackdrop",
  initialState: gameControlBackdropInitialState,
  reducers: {
    setGameState: (state, action: PayloadAction<GameState>) => {
      state.gameState = action.payload
    },
  },
})

export const { setGameState } = gameControlBackdropSlice.actions
export const gameControlBackdropReducer = gameControlBackdropSlice.reducer
