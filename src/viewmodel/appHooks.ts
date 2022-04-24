import { useDispatch, useSelector } from "react-redux"

import type { TypedUseSelectorHook } from "react-redux"
import type { AppDispatch, AppState } from "./appStore"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector
