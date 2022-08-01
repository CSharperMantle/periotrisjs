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

import { IBlockSprite } from "../../viewmodel"

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
