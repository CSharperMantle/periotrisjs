import _ from "lodash"
import { makeAutoObservable } from "mobx"
import { GameUpdateIntervalMilliseconds } from "../common/PeriotrisConst"
import { Position } from "../common/Position"
import { BlockChangedEventArgs } from "../model/BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "../model/Direction"
import { PeriotrisModel } from "../model/PeriotrisModel"
import { IDisplayBlock } from "./IDisplayBlock"
import React from "react"
import { Block } from "../model/Block"

class PeriotrisViewModel {
  public constructor() {
    makeAutoObservable(this)

    this._model.addEventListener("blockchanged", (ev: Event) => {
      this.modelBlockChangedEventHandler(ev)
    })
    this._model.addEventListener("gameend", (ev: Event) => {
      this.modelGameEndEventHandler(ev)
    })

    this.endGame()
  }

  public get gameOver(): boolean {
    return this._model.gameEnded && !this._model.victory
  }

  public get gameWon(): boolean {
    return this._model.gameEnded && this._model.victory
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

  private _that: PeriotrisViewModel = this

  public onKeyDown(ev: React.KeyboardEvent<HTMLElement>): boolean {
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
    for (const element of this._blocksByPosition.values()) {
      _.remove(this.sprites, () => element)
    }
    this._blocksByPosition.clear()
    this._model.startGame()
    this.paused = false
    this._gameIntervalTimerHandle = window.setInterval(() => {
      this.intervalTickEventHandler()
    }, GameUpdateIntervalMilliseconds)
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

  private modelBlockChangedEventHandler(evt: Event): void {
    const args = evt as CustomEvent<BlockChangedEventArgs>
    const e: BlockChangedEventArgs = args.detail
    const block: Block = e.block

    if (!e.disappeared) {
      if (!this._blocksByPosition.has(e.block.position)) {
        const displayBlock: IDisplayBlock = {
          atomicNumber: block.atomicNumber,
          row: block.position.Y,
          column: block.position.X,
          backgroundColor: "white",
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
        _.remove(this.sprites, () => displayBlock)
        this._blocksByPosition.delete(block.position)
      }
    }
  }

  private modelGameEndEventHandler(evt: Event): void {
    // TODO: Empty is okay?
  }

  public test(): void {
    this.startGame()
  }
}

export { PeriotrisViewModel }
