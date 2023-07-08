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

import { StopwatchUpdateIntervalMilliseconds } from "../common"
import {
  addSprites,
  clearSprites,
  removeSprites,
} from "../components/blocksGrid/blocksGridSlice"
import { setGameState } from "../components/gameControlBackdrop/gameControlBackdropSlice"
import {
  setElapsedTime,
  setFastestRecord,
  setIsNewRecord,
} from "../components/timerDisplay/timerDisplaySlice"
import { customizationFacade } from "../customization"
import {
  GameModel,
  GameState,
  MoveDirection,
  RotationDirection,
} from "../model"
import { appStore } from "./appStore"

import type { TPosition } from "../common"
import type { IBlocksChangedEventArgs } from "../model"
import type { IBlockSprite } from "./IBlockSprite"

/**
 * The view model of Periotris.
 */
export class GameViewModel {
  protected _model: GameModel = new GameModel()

  protected readonly _blocksByPosition: Map<TPosition, IBlockSprite> = new Map()

  protected _gameIntervalTimerHandle: number | null = null

  protected _gameStopwatchUpdateTimerHandle: number | null = null

  protected _paused = false

  protected _lastPaused = true

  public onKeyDown(ev: KeyboardEvent): boolean {
    const key = ev.key.toLowerCase()
    ev.preventDefault()
    if (this._paused) {
      if (key !== "escape") {
        // Ignore anything except Esc when paused
        return false
      }
    }
    switch (key) {
      case "a":
        this._model.moveActiveTetrimino(MoveDirection.Left)
        break
      case "s":
        this._model.moveActiveTetrimino(MoveDirection.Down)
        break
      case "d":
        this._model.moveActiveTetrimino(MoveDirection.Right)
        break
      case "w":
        this._model.rotateActiveTetrimino(RotationDirection.Right)
        break
      case " ":
        this._model.instantDropActiveTetrimino()
        break
      case "escape":
        this._paused = !this._paused
        break
      default:
        return false
    }
    return true
  }

  public onTap(duration: number): boolean {
    if (this._paused) {
      return false
    }
    if (duration > customizationFacade.settings.pressThreshold) {
      this._model.instantDropActiveTetrimino()
    } else {
      this._model.rotateActiveTetrimino(RotationDirection.Right)
    }
    return true
  }

  public onSwipe([swipeX, swipeY]: [number, number]): boolean {
    if (this._paused) {
      return false
    }
    switch (swipeX) {
      case -1:
        this._model.moveActiveTetrimino(MoveDirection.Left)
        break
      case 1:
        this._model.moveActiveTetrimino(MoveDirection.Right)
        break
      default:
        break
    }
    switch (swipeY) {
      case -1:
        this._model.moveActiveTetrimino(MoveDirection.Down)
        break
      default:
        break
    }
    return true
  }

  public init(): void {
    this._model.reset()

    this._model.on("blockschanged", (eventArgs) => {
      this.modelBlocksChangedEventHandler(eventArgs)
    })
    this._model.on("gameended", () => {
      this.modelGameEndEventHandler()
    })
    this._model.on("gamestarted", () => {
      this.modelGameStartEventHandler()
    })
    this._model.on("gamestatechanged", () => {
      this.modelGameStateChangedEventHandler()
    })

    this.reset()
  }

  public switchPauseGame(): void {
    if (this._model.gameState !== GameState.InProgress) {
      return // Not allowed to pause/unpause outside of game
    }
    this._paused = !this._paused
  }

  public requestStartGame(): void {
    if (
      [GameState.NotStarted, GameState.Won, GameState.Lost].includes(
        this._model.gameState
      )
    ) {
      this.clearSprites()
      this._model.prepareGame()
      this.refreshGameStatus()
    }
  }

  public reset(): void {
    clearInterval(this._gameIntervalTimerHandle ?? undefined)
    this._gameIntervalTimerHandle = null
    clearInterval(this._gameStopwatchUpdateTimerHandle ?? undefined)
    this._gameStopwatchUpdateTimerHandle = null
    this.clearSprites()
    this.refreshGameStatus()
  }

  protected refreshGameStatus(): void {
    appStore.dispatch(setGameState(this._model.gameState))
    appStore.dispatch(setIsNewRecord(this._model.isNewHighRecord))
    appStore.dispatch(
      setFastestRecord(customizationFacade.history.fastestRecord)
    )
  }

  protected clearSprites(): void {
    appStore.dispatch(clearSprites())
    this._blocksByPosition.clear()
  }

  protected intervalTickEventHandler(): void {
    this._lastPaused =
      this._lastPaused !== this._paused ? this._paused : this._lastPaused

    if (!this._paused) {
      this._model.update()
    }
  }

  protected intervalStopwatchUpdateEventHandler(): void {
    appStore.dispatch(setElapsedTime(this._model.elapsedMilliseconds))
  }

  protected modelBlocksChangedEventHandler(
    eventArgs: IBlocksChangedEventArgs
  ): void {
    const blocks = eventArgs.blocks
    if (!eventArgs.disappeared) {
      const sprites: IBlockSprite[] = []
      blocks.forEach((block) => {
        if (!this._blocksByPosition.has(block.position)) {
          const displayBlock: IBlockSprite = {
            atomicNumber: block.atomicNumber ?? 0,
            row: block.position[1],
            column: block.position[0],
          }
          this._blocksByPosition.set(block.position, displayBlock)
          sprites.push(displayBlock)
        }
      })
      appStore.dispatch(addSprites(sprites))
    } else {
      const sprites = blocks
        .filter((block) => this._blocksByPosition.has(block.position))
        .map((block) => {
          const b = this._blocksByPosition.get(block.position)
          this._blocksByPosition.delete(block.position)
          return b
        }) as IBlockSprite[]
      appStore.dispatch(removeSprites(sprites))
    }
  }

  protected modelGameEndEventHandler(): void {
    this.reset()
  }

  protected modelGameStartEventHandler(): void {
    this.refreshGameStatus()
    this._paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, customizationFacade.settings.gameUpdateIntervalMilliseconds)
    this._gameStopwatchUpdateTimerHandle = window.setInterval(() => {
      this.intervalStopwatchUpdateEventHandler()
    }, StopwatchUpdateIntervalMilliseconds)
  }

  protected modelGameStateChangedEventHandler(): void {
    this.refreshGameStatus()
  }
}
