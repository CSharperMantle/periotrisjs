import { createSlice } from "@reduxjs/toolkit"

import { IBlockSprite } from "../viewmodel"

import type { PayloadAction } from "@reduxjs/toolkit"

interface IBlocksGridState {
  sprites: IBlockSprite[]
}

const blocksGridInitialState: IBlocksGridState = { sprites: [] }

export const blocksGridSlice = createSlice({
  name: "blocksGrid",
  initialState: blocksGridInitialState,
  reducers: {
    addSprite: (state, action: PayloadAction<IBlockSprite>) => {
      state.sprites.push(action.payload)
    },
    removeSprite: (state, action: PayloadAction<IBlockSprite>) => {
      state.sprites.splice(state.sprites.indexOf(action.payload), 1)
    },
    clearSprites: (state) => {
      state.sprites = []
    },
  },
})

export const { addSprite, removeSprite, clearSprites } = blocksGridSlice.actions
export const blocksGridReducer = blocksGridSlice.reducer
