import dayjs, { Dayjs } from "dayjs"
import { EventEmitter } from "events"
import { isBrowser } from "is-in-browser"
import _ from "lodash"
import { makeObservable, observable, action } from "mobx"
import { createContext } from "react"

import { Position, StopwatchUpdateIntervalMilliseconds } from "../common"
import {
  Block,
  BlockChangedEventArgs,
  GameState,
  MoveDirection,
  GameModel,
  RotationDirection,
} from "../model"

import type { IDisplayBlock } from "./IDisplayBlock"

const Hammer: HammerStatic = isBrowser ? require("hammerjs") : null

type TGameViewModelObservablePrivateFields =
  keyof typeof GameViewModelPrivateAnnotationsMap

const GameViewModelPublicAnnotationsMap = {
  paused: observable,
  sprites: observable,

  onKeyDown: action,
  onTap: action,
  onSwipe: action,
  onPressUp: action,
  requestStartGame: action,
  switchPauseGame: action,
}

const GameViewModelPrivateAnnotationsMap = {
  _gameState: observable,
  _elapsedTime: observable,
  _fastestRecord: observable,
  _isNewRecord: observable,

  endGame: action,
  refreshGameStatus: action,
  intervalTickEventHandler: action,
  intervalStopwatchUpdateEventHandler: action,
  onGameStateChanged: action,
  modelBlockChangedEventHandler: action,
  modelGameEndEventHandler: action,
  modelGameStartEventHandler: action,
}

const GameViewModelAnnotationsMap = {
  ...GameViewModelPublicAnnotationsMap,
  ...GameViewModelPrivateAnnotationsMap,
}

class GameViewModel extends EventEmitter {
  public constructor() {
    super()

    makeObservable<GameViewModel, TGameViewModelObservablePrivateFields>(
      this,
      GameViewModelAnnotationsMap
    )

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

  private _gameState = GameState.NotStarted
  public get gameState(): GameState {
    return this._gameState
  }
  private set gameState(v: GameState) {
    this._gameState = v
  }

  private _elapsedTime: Dayjs = dayjs(0)
  public get elapsedTime(): Dayjs {
    return this._elapsedTime
  }
  private set elapsedTime(v: Dayjs) {
    this._elapsedTime = v
  }

  private _fastestRecord: Dayjs = dayjs(0)
  public get fastestRecord(): Dayjs {
    return this._fastestRecord
  }
  private set fastestRecord(v: Dayjs) {
    this._fastestRecord = v
  }

  private _isNewRecord = false
  public get isNewRecord(): boolean {
    return this._isNewRecord
  }
  private set isNewRecord(v: boolean) {
    this._isNewRecord = v
  }

  public get showGridLine(): boolean {
    return this._model.settings.showGridLine
  }

  public paused = false

  public readonly sprites: IDisplayBlock[] = []

  private readonly _model: GameModel = new GameModel()

  private readonly _blocksByPosition: Map<Position, IDisplayBlock> = new Map()

  private _gameIntervalTimerHandle = -1

  private _gameStopwatchUpdateTimerHandle = -1

  private _lastPaused = true

  public onKeyDown(ev: KeyboardEvent): boolean {
    const key: string = ev.key.toLowerCase()
    ev.preventDefault()
    if (this.paused) {
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
        this.paused = !this.paused
        break
      default:
        return false
    }
    return true
  }

  public onTap(): boolean {
    if (this.paused) {
      return false
    }
    this._model.rotateActiveTetrimino(RotationDirection.Right)
    return true
  }

  public onSwipe(ev: HammerInput): boolean {
    if (this.paused) {
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
    if (this.paused) {
      return false
    }
    this._model.instantDropActiveTetrimino()
    return true
  }

  public switchPauseGame(): void {
    if (this.gameState !== GameState.InProgress) {
      return // Not allowed to pause/unpause outside of game
    }
    this.paused = !this.paused
  }

  public requestStartGame(): void {
    if ([GameState.InProgress, GameState.Preparing].includes(this.gameState)) {
      return // Not allowed to start game twice
    }
    for (const element of this._blocksByPosition.values()) {
      _.remove(this.sprites, (value: IDisplayBlock) =>
        _.isEqual(value, element)
      )
    }
    this._blocksByPosition.clear()
    this._model.prepareGame()
    this.refreshGameStatus()
  }

  private endGame(): void {
    if (this._gameIntervalTimerHandle !== -1) {
      clearInterval(this._gameIntervalTimerHandle)
    }
    if (this._gameStopwatchUpdateTimerHandle !== -1) {
      clearInterval(this._gameStopwatchUpdateTimerHandle)
    }
    this.refreshGameStatus()
  }

  private refreshGameStatus(): void {
    this.gameState = this._model.gameState
    this.isNewRecord = this._model.isNewRecord
    this.fastestRecord = _.isNil(this._model.history.fastestRecord)
      ? dayjs(0)
      : this._model.history.fastestRecord
  }

  private intervalTickEventHandler(): void {
    if (this._lastPaused !== this.paused) {
      this.paused = !!this.paused // Force update event
      this._lastPaused = this.paused
    }

    if (!this.paused) {
      this._model.update()
    }
  }

  private intervalStopwatchUpdateEventHandler(): void {
    this.elapsedTime = dayjs(this._model.elapsedMilliseconds)
  }

  private onGameStateChanged(): void {
    this.emit("gamestatechanged")
  }

  private modelBlockChangedEventHandler(
    eventArgs: BlockChangedEventArgs
  ): void {
    const block: Block = eventArgs.block

    if (!eventArgs.disappeared) {
      if (!this._blocksByPosition.has(eventArgs.block.position)) {
        const displayBlock: IDisplayBlock = {
          withContent: true,
          withBorder: this.showGridLine,
          atomicNumber: block.atomicNumber,
          row: block.position.y,
          column: block.position.x,
          symbolColor: "black",
        }
        this._blocksByPosition.set(block.position, displayBlock)
        this.sprites.push(displayBlock)
      }
    } else {
      if (this._blocksByPosition.has(block.position)) {
        const displayBlock = this._blocksByPosition.get(block.position)
        _.remove(this.sprites, (value: IDisplayBlock) =>
          _.isEqual(value, displayBlock)
        )
        this._blocksByPosition.delete(block.position)
      }
    }
  }

  private modelGameEndEventHandler(): void {
    this.endGame()
  }

  private modelGameStartEventHandler(): void {
    this.refreshGameStatus()
    this.paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, this._model.settings.gameUpdateIntervalMilliseconds)
    this._gameStopwatchUpdateTimerHandle = window.setInterval(() => {
      this.intervalStopwatchUpdateEventHandler()
    }, StopwatchUpdateIntervalMilliseconds)
  }

  private modelGameStateChangedEventHandler(): void {
    this.refreshGameStatus()
    this.onGameStateChanged()
  }
}

const GameViewModelContext = createContext<GameViewModel>(
  undefined as unknown as GameViewModel
)

export { GameViewModel, GameViewModelContext }
