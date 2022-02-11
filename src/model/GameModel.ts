import dayjs from "dayjs"
import { EventEmitter } from "events"
import { isBrowser } from "is-in-browser"
import _ from "lodash"
import PatternGeneratorWorker from "worker-loader!./generation/PatternGeneratorWorker"

import { PlayAreaHeight, PlayAreaWidth } from "../common"
import { History } from "../customization/history"
import { Settings } from "../customization/settings"
import defaultMap from "../json/DefaultMap.json"
import { Block } from "./Block"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "./Direction"
import { GameState } from "./GameState"
import { getPlayablePattern, MessageType } from "./generation"
import { repairBrokenTetriminos, Tetrimino } from "./Tetrimino"

import type { IGeneratorMessage } from "./generation"

class GameModel extends EventEmitter {
  private readonly _patternGeneratorWorker: PatternGeneratorWorker = isBrowser
    ? new PatternGeneratorWorker()
    : (undefined as unknown as PatternGeneratorWorker)

  private readonly _frozenBlocks: Block[] = []
  private readonly _pendingTetriminos: Tetrimino[] = []
  private _activeTetrimino: Tetrimino | null = null

  public readonly settings: Settings = Settings.fromLocalStorage()

  public readonly history: History = History.fromLocalStorage()

  private _gameState: GameState = GameState.NotStarted
  public get gameState(): GameState {
    return this._gameState
  }
  private set gameState(v: GameState) {
    this._gameState = v
    this.onGameStateChanged()
  }

  private _isNewRecord = false
  public get isNewRecord(): boolean {
    return this._isNewRecord
  }
  private set isNewRecord(v: boolean) {
    this._isNewRecord = v
  }

  private _startDate = Date.now()

  private _endDate = Date.now()

  public get elapsedMilliseconds(): number {
    switch (this.gameState) {
      case GameState.InProgress:
        return Date.now() - this._startDate
      case GameState.Lost:
      case GameState.Won:
        return this._endDate - this._startDate
      default:
        return 0
    }
  }

  private endGame(victory: boolean): void {
    if (victory) {
      this.gameState = GameState.Won
    } else {
      if (this.gameState !== GameState.NotStarted) {
        this.gameState = GameState.Lost
      }
    }
    this._pendingTetriminos.length = 0
    this.onGameEnded()
    this._endDate = Date.now()

    if (victory) {
      this.isNewRecord = this.history.add(dayjs(this.elapsedMilliseconds))
    }
  }

  public instantDropActiveTetrimino(): void {
    if (this.gameState !== GameState.InProgress) return
    this.updateActiveTetrimino(true)
    while (
      !_.isNil(this._activeTetrimino) &&
      this._activeTetrimino.tryMove(
        MoveDirection.Down,
        this.checkBlockCollision.bind(this)
      )
    );
    this.updateActiveTetrimino(false)
  }

  public moveActiveTetrimino(direction: MoveDirection): void {
    if (
      this.gameState !== GameState.InProgress ||
      _.isNil(this._activeTetrimino)
    ) {
      return
    }

    this.updateActiveTetrimino(true)

    if (direction === MoveDirection.Down) {
      if (
        !this._activeTetrimino.tryMove(
          direction,
          this.checkBlockCollision.bind(this)
        )
      ) {
        this.freezeActiveTetrimino()
        this.updateActiveTetrimino(false)
        this.spawnNextTetrimino()
      }
    } else {
      this._activeTetrimino.tryMove(
        direction,
        this.checkBlockCollision.bind(this)
      )
    }
    this.updateActiveTetrimino(false)
  }

  public rotateActiveTetrimino(direction: RotationDirection): void {
    if (this.gameState !== GameState.InProgress) {
      return
    }

    this.updateActiveTetrimino(true)
    !_.isNil(this._activeTetrimino) &&
      this._activeTetrimino.tryRotate(
        direction,
        this.checkBlockCollision.bind(this)
      )
    this.updateActiveTetrimino(false)
  }

  public prepareGame(): void {
    for (let i = 0, len = this._frozenBlocks.length; i < len; i++) {
      const block = this._frozenBlocks[i]
      this.onBlockChanged(block, true)
    }
    this._frozenBlocks.length = 0

    if (!_.isNil(this._activeTetrimino)) {
      this.updateActiveTetrimino(true)
      this._activeTetrimino = null
    }

    this.gameState = GameState.Preparing

    if (isBrowser) {
      // We have workers.
      const message: IGeneratorMessage<unknown> = {
        type: MessageType.RequestGeneration,
        content: null,
      }
      this._patternGeneratorWorker.postMessage(message)
    } else {
      console.warn(
        "Web workers unavailable. Running pattern generator on UI thread."
      )
      getPlayablePattern().then((tetriminos) => {
        this.startPreparedGame(tetriminos)
      })
    }
  }

  private startPreparedGame(tetriminos: Tetrimino[]): void {
    const generatedTetrimino: Tetrimino[] = tetriminos.reverse()
    this._pendingTetriminos.push(...generatedTetrimino)

    this.spawnNextTetrimino()
    this.gameState = GameState.InProgress
    this._startDate = Date.now()
    this.onGameStarted()
  }

  public update(): void {
    if (this.gameState !== GameState.InProgress) {
      return
    }

    this.moveActiveTetrimino(MoveDirection.Down)
    for (let i = 0, len = this._frozenBlocks.length; i < len; i++) {
      const block = this._frozenBlocks[i]
      if (
        defaultMap.periodicTable[block.position.y][block.position.x]
          .atomicNumber !== block.atomicNumber
      ) {
        this.endGame(false)
        break
      }
    }

    if (this._frozenBlocks.length >= defaultMap.totalAvailableBlocksCount) {
      this.endGame(true)
    }
  }

  public constructor() {
    super()

    if (isBrowser) {
      // Assign Worker message handler
      this._patternGeneratorWorker.addEventListener(
        "message",
        (eventArgs: MessageEvent<IGeneratorMessage<Tetrimino[]>>) => {
          const data = eventArgs.data
          if (data.type === MessageType.ResponseSuccess) {
            const content = data.content
            const fixedTetriminos = repairBrokenTetriminos(content)
            this.startPreparedGame(fixedTetriminos)
          } else {
            console.warn(data)
          }
        }
      )
    }

    this.endGame(false)
  }

  private updateFrozenBlocks(): void {
    for (let i = 0, len = this._frozenBlocks.length; i < len; i++) {
      const block = this._frozenBlocks[i]
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    }
  }

  private onGameStarted(): void {
    this.emit("gamestarted")
  }

  private onGameEnded(): void {
    this.emit("gameended")
  }

  private onBlockChanged(block: Block, disappeared: boolean): void {
    this.emit("blockchanged", new BlockChangedEventArgs(block, disappeared))
  }

  private onGameStateChanged(): void {
    this.emit("gamestatechanged")
  }

  private checkBlockCollision(block: Block): boolean {
    if (block.position.x < 0 || block.position.x >= PlayAreaWidth) {
      return true
    }
    if (block.position.y >= PlayAreaHeight) {
      return true
    }
    return this._frozenBlocks.some((frozenBlock: Block): boolean => {
      return frozenBlock.position.equals(block.position)
    })
  }

  private freezeActiveTetrimino(): void {
    if (_.isNil(this._activeTetrimino)) {
      console.warn("PeriotrisModel.freezeActiveTetrimino() null check")
      return
    }
    this._frozenBlocks.push(...this._activeTetrimino.blocks)
    this.updateFrozenBlocks()
  }

  private spawnNextTetrimino(): void {
    if (this._pendingTetriminos.length > 0) {
      const poppedTetrimino = this._pendingTetriminos.pop()
      if (!_.isNil(poppedTetrimino)) {
        this._activeTetrimino = poppedTetrimino
      } else {
        console.warn("PeriotrisModel.spawnNextTetrimino() null check")
        return
      }
      this.updateActiveTetrimino(false)
    }
  }

  private updateActiveTetrimino(disappeared: boolean): void {
    if (!_.isNil(this._activeTetrimino)) {
      for (let i = 0, len = this._activeTetrimino.blocks.length; i < len; i++) {
        const block = this._activeTetrimino.blocks[i]
        this.onBlockChanged(block, disappeared)
      }
    }
  }
}

export { GameModel }
