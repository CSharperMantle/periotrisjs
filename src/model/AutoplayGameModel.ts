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

import { customizationFacade } from "../customization"
import { GameModel, generateTetriminos } from "./GameModel"
import { GameState } from "./GameState"
import { repairBrokenTetriminos } from "./Tetrimino"
import { primeTetriminos } from "./generation"

export class AutoplayGameModel extends GameModel {
  public override async prepareGame(): Promise<void> {
    this.onBlocksChanged(this._frozenBlocks, true)
    this._frozenBlocks.length = 0

    this.updateActiveTetrimino(true)
    this._activeTetrimino = null

    this.gameState = GameState.Preparing
    const tetriminos = repairBrokenTetriminos(await generateTetriminos())
    primeTetriminos(
      tetriminos,
      customizationFacade.settings.gameMap.playAreaSize,
      true
    )
    this.startPreparedGame(tetriminos)
  }

  protected override endGame(victory: boolean): void {
    if (this.gameState !== GameState.NotStarted) {
      this.gameState = victory ? GameState.Won : GameState.Lost
    }
    this._pendingTetriminos.length = 0
    this._endDate = Date.now()
    this.onGameEnded()
  }
}
