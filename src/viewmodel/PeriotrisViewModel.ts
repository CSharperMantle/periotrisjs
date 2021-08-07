import _ from "lodash"
import { makeAutoObservable } from "mobx"
import { GameUpdateIntervalMilliseconds } from "../common/PeriotrisConst"
import { Position } from "../common/Position"
import { BlockChangedEventArgs } from "../model/BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "../model/Direction"
import { PeriotrisModel } from "../model/PeriotrisModel"
import { IDisplayBlock } from "./IDisplayBlock"
import { Block } from "../model/Block"
import { createContext } from "react"
import { GameState } from "../model/GameState"

class PeriotrisViewModel {
  public constructor() {
    makeAutoObservable(this)

    this._model.addListener("blockchanged", (eventArgs) => {
      this.modelBlockChangedEventHandler(eventArgs)
    })
    this._model.addListener("gameend", () => {
      this.modelGameEndEventHandler()
    })

    this.endGame()
  }

  private _gameOver: boolean = true

  public get gameOver(): boolean {
    return this._gameOver
  }
  public set gameOver(v: boolean) {
    this._gameOver = v
  }

  private _gameWon: boolean = false

  public get gameWon(): boolean {
    return this._gameWon
  }
  public set gameWon(v: boolean) {
    this._gameWon = v
  }

  private _gameState: GameState = GameState.NotStarted
  public get gameState(): GameState {
    return this._gameState
  }
  public set gameState(v: GameState) {
    this._gameState = v
  }

  private _paused: boolean = false

  public get paused(): boolean {
    return this._paused
  }

  public set paused(v: boolean) {
    this._paused = v
  }

  private _sprites: IDisplayBlock[] = []

  public get sprites(): IDisplayBlock[] {
    return this._sprites
  }

  private set sprites(v: IDisplayBlock[]) {
    this._sprites = v
  }

  private readonly _model: PeriotrisModel = new PeriotrisModel()

  private readonly _blocksByPosition: Map<Position, IDisplayBlock> = new Map()

  private _gameIntervalTimerHandle: number = -1

  private _lastPaused: boolean = true

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

  public invokeGameControl(): void {
    switch (this.gameState) {
      case GameState.InProgress:
        this.paused = !this.paused
        break
      case GameState.Lost:
      case GameState.Won:
      case GameState.NotStarted:
        this.startGame()
        break
      default:
        throw new RangeError("gameState")
    }
  }

  private startGame(): void {
    for (const element of this._blocksByPosition.values()) {
      _.remove(this.sprites, (value: IDisplayBlock) =>
        _.isEqual(value, element)
      )
    }
    this._blocksByPosition.clear()
    this._model.startGame()
    this.refreshGameStatus()
    this.paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, GameUpdateIntervalMilliseconds)
  }

  private endGame(): void {
    if (!_.isNil(this._gameIntervalTimerHandle)) {
      clearInterval(this._gameIntervalTimerHandle)
    }
    this.refreshGameStatus()
  }

  private refreshGameStatus(): void {
    this.gameOver = this._model.gameState === GameState.Lost
    this.gameWon = this._model.gameState === GameState.Won
    this.gameState = this._model.gameState
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

  private modelBlockChangedEventHandler(
    eventArgs: BlockChangedEventArgs
  ): void {
    const block: Block = eventArgs.block

    if (!eventArgs.disappeared) {
      if (!this._blocksByPosition.has(eventArgs.block.position)) {
        const displayBlock: IDisplayBlock = {
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
        )!
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
}

const PeriotrisViewModelContext = createContext<PeriotrisViewModel>(
  new PeriotrisViewModel() // Only a placeholder; use Provider when needed
)

export { PeriotrisViewModel, PeriotrisViewModelContext }
