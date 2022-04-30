import { isBrowser } from "is-in-browser"

import { Position, StopwatchUpdateIntervalMilliseconds } from "../common"
import {
  addSprite,
  clearSprites,
  removeSprite,
} from "../components/blocksGrid/blocksGridSlice"
import { setGameState } from "../components/gameControlBackdrop/gameControlBackdropSlice"
import {
  setElapsedTime,
  setFastestRecord,
  setIsNewRecord,
} from "../components/timerDisplay/timerDisplaySlice"
import { customizationFacade } from "../customization"
import {
  BlockChangedEventArgs,
  GameModel,
  GameState,
  MoveDirection,
  RotationDirection,
} from "../model"
import { appStore } from "./appStore"

import type { IBlockSprite } from "./IBlockSprite"
const Hammer: HammerStatic = isBrowser ? require("hammerjs") : null

/**
 * The view model of Periotris.
 */
export class GameViewModel {
  public constructor() {
    this._model.on("blockchanged", (eventArgs) => {
      this.modelBlockChangedEventHandler(eventArgs)
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

    this.endGame()
  }

  private readonly _model: GameModel = new GameModel()

  private readonly _blocksByPosition: Map<Position, IBlockSprite> = new Map()

  private _gameIntervalTimerHandle: number | null = null

  private _gameStopwatchUpdateTimerHandle: number | null = null

  private _paused = false

  private _lastPaused = true

  public onKeyDown(ev: KeyboardEvent): boolean {
    const key: string = ev.key.toLowerCase()
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

  public onTap(): boolean {
    if (this._paused) {
      return false
    }
    this._model.rotateActiveTetrimino(RotationDirection.Right)
    return true
  }

  public onSwipe(ev: HammerInput): boolean {
    if (this._paused) {
      return false
    }
    switch (ev.direction) {
      case Hammer.DIRECTION_LEFT:
        this._model.moveActiveTetrimino(MoveDirection.Left)
        break
      case Hammer.DIRECTION_RIGHT:
        this._model.moveActiveTetrimino(MoveDirection.Right)
        break
      case Hammer.DIRECTION_DOWN:
        this._model.moveActiveTetrimino(MoveDirection.Down)
        break
      default:
        return false
    }
    return true
  }

  public onPressUp(): boolean {
    if (this._paused) {
      return false
    }
    this._model.instantDropActiveTetrimino()
    return true
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
      appStore.dispatch(clearSprites())
      this._blocksByPosition.clear()
      this._model.prepareGame()
      this.refreshGameStatus()
    }
  }

  private endGame(): void {
    clearInterval(this._gameIntervalTimerHandle ?? undefined)
    this._gameIntervalTimerHandle = null
    clearInterval(this._gameStopwatchUpdateTimerHandle ?? undefined)
    this._gameStopwatchUpdateTimerHandle = null
    this.refreshGameStatus()
  }

  private refreshGameStatus(): void {
    appStore.dispatch(setGameState(this._model.gameState))
    appStore.dispatch(setIsNewRecord(this._model.isNewHighRecord))
    appStore.dispatch(
      setFastestRecord(customizationFacade.history.fastestRecord)
    )
  }

  private intervalTickEventHandler(): void {
    this._lastPaused =
      this._lastPaused !== this._paused ? this._paused : this._lastPaused

    if (!this._paused) {
      this._model.update()
    }
  }

  private intervalStopwatchUpdateEventHandler(): void {
    appStore.dispatch(setElapsedTime(this._model.elapsedMilliseconds))
  }

  private modelBlockChangedEventHandler(
    eventArgs: BlockChangedEventArgs
  ): void {
    const block = eventArgs.block

    if (!eventArgs.disappeared) {
      if (!this._blocksByPosition.has(eventArgs.block.position)) {
        const displayBlock: IBlockSprite = {
          atomicNumber: block.atomicNumber,
          row: block.position.y,
          column: block.position.x,
        }
        this._blocksByPosition.set(block.position, displayBlock)
        appStore.dispatch(addSprite(displayBlock))
      }
    } else {
      if (this._blocksByPosition.has(block.position)) {
        const displayBlock = this._blocksByPosition.get(
          block.position
        ) as IBlockSprite
        appStore.dispatch(removeSprite(displayBlock))
        this._blocksByPosition.delete(block.position)
      }
    }
  }

  private modelGameEndEventHandler(): void {
    this.endGame()
  }

  private modelGameStartEventHandler(): void {
    this.refreshGameStatus()
    this._paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, customizationFacade.settings.gameUpdateIntervalMilliseconds)
    this._gameStopwatchUpdateTimerHandle = window.setInterval(() => {
      this.intervalStopwatchUpdateEventHandler()
    }, StopwatchUpdateIntervalMilliseconds)
  }

  private modelGameStateChangedEventHandler(): void {
    this.refreshGameStatus()
  }
}
