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

import { AutoplaySentinel } from "../common"
import { setGameState } from "../components/gameControlBackdrop/gameControlBackdropSlice"
import {
  setFastestRecord,
  setIsNewRecord,
} from "../components/timerDisplay/timerDisplaySlice"
import { AutoplayGameModel } from "../model"
import { GameViewModel } from "./GameViewModel"
import { appStore } from "./appStore"

export class AutoplayGameViewModel extends GameViewModel {
  protected override _model: AutoplayGameModel = new AutoplayGameModel()

  protected override refreshGameStatus(): void {
    appStore.dispatch(setGameState(this._model.gameState))
    appStore.dispatch(setIsNewRecord(this._model.isNewHighRecord))
    appStore.dispatch(setFastestRecord(new AutoplaySentinel()))
  }
}
