import { EventEmitter } from "events"
import _ from "lodash"
import { action, makeObservable, observable } from "mobx"
import { createContext } from "react"

import { isBrowserEnv } from "../common/IsBrowserEnv"
import {
  GameUpdateIntervalMilliseconds,
  StopwatchUpdateIntervalMilliseconds,
} from "../common/PeriotrisConst"
import { Position } from "../common/Position"
import { Block } from "../model/Block"
import { BlockChangedEventArgs } from "../model/BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "../model/Direction"
import { GameState } from "../model/GameState"
import { PeriotrisModel } from "../model/PeriotrisModel"
import { IDisplayBlock } from "./IDisplayBlock"

const Hammer = isBrowserEnv() ? require("hammerjs") : null

class PeriotrisViewModel extends EventEmitter {
  public constructor() {
    super()

    makeObservable(this)

    this._model.addListener("blockchanged", (eventArgs) => {
      this.modelBlockChangedEventHandler(eventArgs)
    })
    this._model.addListener("gameend", () => {
      this.modelGameEndEventHandler()
    })
    this._model.addListener("gamestart", () => {
      this.modelGameStartEventHandler()
    })

    this.endGame()
  }

  @observable
  private _gameState = GameState.NotStarted

  public get gameState(): GameState {
    return this._gameState
  }
  public set gameState(v: GameState) {
    this._gameState = v
  }

  @observable
  private _elapsedMilliseconds = 0

  public get elapsedMilliseconds(): number {
    return this._elapsedMilliseconds
  }
  private set elapsedMilliseconds(v: number) {
    this._elapsedMilliseconds = v
  }

  @observable
  private _isNewRecord = false

  public get isNewRecord(): boolean {
    return this._isNewRecord
  }
  public set isNewRecord(v: boolean) {
    this._isNewRecord = v
  }

  @observable
  public paused = false

  @observable
  public readonly sprites: IDisplayBlock[] = []

  private readonly _model: PeriotrisModel = new PeriotrisModel()

  private readonly _blocksByPosition: Map<Position, IDisplayBlock> = new Map()

  private _gameIntervalTimerHandle = -1

  private _gameStopwatchUpdateTimerHandle = -1

  private _lastPaused = true

  @action
  public onKeyDown(ev: KeyboardEvent): boolean {
    const key: string = _.toLower(ev.key)
    if (this.paused) {
      if (key === "escape") {
        this.paused = !this.paused
      }
      return true
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
    ev.preventDefault()
    return true
  }

  @action
  public onTap(): boolean {
    if (this.paused) {
      return false
    }
    this._model.rotateActiveTetrimino(RotationDirection.Right)
    return true
  }

  @action
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

  @action
  public onPressUp(): boolean {
    if (this.paused) {
      return false
    }
    this._model.instantDropActiveTetrimino()
    return true
  }

  @action
  public invokeGameControl(): void {
    switch (this.gameState) {
      case GameState.InProgress:
        this.paused = !this.paused
        break
      case GameState.Lost:
      case GameState.Won:
      case GameState.NotStarted:
        this.prepareStartGame()
        break
      default:
        throw new RangeError("gameState")
    }
  }

  @action
  private prepareStartGame(): void {
    for (const element of this._blocksByPosition.values()) {
      _.remove(this.sprites, (value: IDisplayBlock) =>
        _.isEqual(value, element)
      )
    }
    this._blocksByPosition.clear()
    this._model.prepareStartGame()
    this.refreshGameStatus()
  }

  @action
  private realStartGame(): void {
    this.refreshGameStatus()
    this.paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, GameUpdateIntervalMilliseconds)
    this._gameStopwatchUpdateTimerHandle = window.setInterval(() => {
      this.intervalStopwatchUpdateEventHandler()
    }, StopwatchUpdateIntervalMilliseconds)
  }

  @action
  private endGame(): void {
    if (this._gameIntervalTimerHandle !== -1) {
      clearInterval(this._gameIntervalTimerHandle)
    }
    if (this._gameStopwatchUpdateTimerHandle !== -1) {
      clearInterval(this._gameStopwatchUpdateTimerHandle)
    }
    this.refreshGameStatus()
  }

  @action
  private refreshGameStatus(): void {
    this.gameState = this._model.gameState
    this.isNewRecord = this._model.isNewRecord
    this.onGameStateChanged()
  }

  @action
  private intervalTickEventHandler(): void {
    if (this._lastPaused !== this.paused) {
      this.paused = !!this.paused // Force update event
      this._lastPaused = this.paused
    }

    if (!this.paused) {
      this._model.update()
    }
  }

  @action
  private intervalStopwatchUpdateEventHandler(): void {
    this.elapsedMilliseconds = this._model.elapsedMilliseconds
  }

  @action
  private onGameStateChanged(): void {
    this.emit("gamestatechanged")
  }

  @action
  private modelBlockChangedEventHandler(
    eventArgs: BlockChangedEventArgs
  ): void {
    const block: Block = eventArgs.block

    if (!eventArgs.disappeared) {
      if (!this._blocksByPosition.has(eventArgs.block.position)) {
        const displayBlock: IDisplayBlock = {
          withContent: true,
          atomicNumber: block.atomicNumber,
          row: block.position.Y,
          column: block.position.X,
          symbolColor: "black",
        }
        this._blocksByPosition.set(block.position, displayBlock)
        this.sprites.push(displayBlock)
      }
    } else {
      if (this._blocksByPosition.has(block.position)) {
        const displayBlock: IDisplayBlock = this._blocksByPosition.get(
          block.position
        )
        _.remove(this.sprites, (value: IDisplayBlock) =>
          _.isEqual(value, displayBlock)
        )
        this._blocksByPosition.delete(block.position)
      }
    }
  }

  @action
  private modelGameEndEventHandler(): void {
    this.endGame()
  }

  @action
  private modelGameStartEventHandler(): void {
    this.realStartGame()
  }
}

const PeriotrisViewModelContext = createContext<PeriotrisViewModel>(undefined)

export { PeriotrisViewModel, PeriotrisViewModelContext }
