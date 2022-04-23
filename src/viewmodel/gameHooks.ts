import { useDispatch, useSelector } from "react-redux"

import type { TypedUseSelectorHook } from "react-redux"
import type { GameDispatch, GameState } from "./gameStore"

export const useGameDispatch = () => useDispatch<GameDispatch>()
export const useGameSelector: TypedUseSelectorHook<GameState> = useSelector
