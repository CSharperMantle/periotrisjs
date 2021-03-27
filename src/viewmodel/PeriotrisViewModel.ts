import _ from "lodash"
import { observable, computed, action } from "mobx"
import React from "react"
import {
  GameUpdateIntervalMilliseconds,
  PlayAreaWidth,
} from "../common/PeriotrisConst"
import { Position } from "../common/Position"
import { BlockChangedEventArgs } from "../model/BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "../model/Direction"
import { PeriotrisModel } from "../model/PeriotrisModel"

class PeriotrisViewModel {
  public constructor() {
    PeriotrisViewModel.scale = 1

    this._model.addEventListener(
      "blockchanged",
      this.modelBlockChangedEventHandler
    )
    this._model.addEventListener("gameend", this.modelGameEndEventHandler)

    this.endGame()
  }

  @observable
  private static _scale: number = 0

  @computed
  public static get scale(): number {
    return this._scale
  }

  private static set scale(v: number) {
    this._scale = v
  }

  @computed
  public get gameOver(): boolean {
    return this._model.gameEnded && !this._model.victory
  }

  @observable public get gameWon(): boolean {
    return this._model.gameEnded && this._model.victory
  }

  @observable private _paused: boolean = false

  @computed
  public get paused(): boolean {
    return this._paused
  }

  public set paused(v: boolean) {
    this._paused = v
  }

  public set playAreaSize(v: { width: number; height: number }) {
    PeriotrisViewModel.scale = v.width / PlayAreaWidth
    this._model.updateAllBlocks()
    this.recreateAssistGrid()
  }

  @observable
  private _sprites: React.Component[] = []

  @computed
  public get sprites(): React.Component[] {
    return this._sprites
  }

  private set sprites(v: React.Component[]) {
    this._sprites = v
  }

  private readonly _model: PeriotrisModel = new PeriotrisModel()

  private readonly _blocksByPosition: Map<Position, React.Component> = new Map()

  private readonly _assistGridLines: React.Component[] = []

  private _gameIntervalTimerHandle: number = null

  private _lastPaused: boolean = true

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
      case "space":
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

  public startGame(): void {
    this.recreateAssistGrid()
    for (const element of this._blocksByPosition.values()) {
      _.remove(this.sprites, () => element)
    }
    this._blocksByPosition.clear()
    this._model.startGame()
    this.paused = false
    this._gameIntervalTimerHandle = window.setInterval(
      this.intervalTickEventHandler,
      GameUpdateIntervalMilliseconds
    )
  }

  private endGame(): void {
    if (!_.isNil(this._gameIntervalTimerHandle)) {
      clearInterval(this._gameIntervalTimerHandle)
    }
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

  private modelBlockChangedEventHandler(args: {
    detail: BlockChangedEventArgs
  }): void {
    const e: BlockChangedEventArgs = args.detail
    if (!e.disappeared) {
      if (!this._blocksByPosition.has(e.block.position)) {
        const newBlockControl = annotatedBlockControlFactory(
          e.block,
          PeriotrisViewModel.scale
        )
        this._blocksByPosition.set(e.block.position, newBlockControl)
        this.sprites.push(newBlockControl)
      }
    }
  }
}
