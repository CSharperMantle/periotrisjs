import dayjs from "dayjs"
import { EventEmitter } from "events"
import { isBrowser } from "is-in-browser"
import _ from "lodash"
import PatternGeneratorWorker from "worker-loader!./generation/PatternGeneratorWorker"

import { PlayAreaHeight, PlayAreaWidth } from "../common"
import { History } from "../customization/history"
import defaultMap from "../json/DefaultMap.json"
import { Block } from "./Block"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "./Direction"
import { GameState } from "./GameState"
import {
  getPlayablePattern,
  IGeneratorMessage,
  MessageType,
} from "./generation"
import { repairBrokenTetriminos, Tetrimino } from "./Tetrimino"

class PeriotrisModel extends EventEmitter {
  private readonly _patternGeneratorWorker: PatternGeneratorWorker = isBrowser
    ? new PatternGeneratorWorker()
    : (undefined as unknown as PatternGeneratorWorker)

  private readonly _frozenBlocks: Block[] = []
  private readonly _pendingTetriminos: Tetrimino[] = []
  private _activeTetrimino: Tetrimino | null = null

  private _history: History
  public get history(): History {
    return this._history
  }
  private set history(v: History) {
    this._history = v
  }

  private _gameState: GameState = GameState.NotStarted
  public get gameState(): GameState {
    return this._gameState
  }
  private set gameState(v: GameState) {
    this._gameState = v
  }

  private _startDate: number = Date.now()
  public get startDate(): number {
    return this._startDate
  }
  private set startDate(v: number) {
    this._startDate = v
  }

  private _endDate = Date.now()
  public get endDate(): number {
    return this._endDate
  }
  private set endDate(v: number) {
    this._endDate = v
  }

  private _isNewRecord = false
  public get isNewRecord(): boolean {
    return this._isNewRecord
  }
  private set isNewRecord(v: boolean) {
    this._isNewRecord = v
  }

  public get elapsedMilliseconds(): number {
    switch (this.gameState) {
      case GameState.InProgress:
        return Date.now() - this.startDate
      case GameState.Lost:
      case GameState.Won:
        return this.endDate - this.startDate
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
    this.onGameEnd()
    this.endDate = Date.now()

    if (victory) {
      this.isNewRecord = this.history.add(dayjs(this.elapsedMilliseconds))
      History.toLocalStorage(this.history)
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

  public prepareStartGame(): void {
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
      // We have workers
      const message: IGeneratorMessage<unknown> = {
        type: MessageType.RequestGeneration,
        content: null,
      }
      this._patternGeneratorWorker.postMessage(message)
    } else {
      // Use single-threaded approach
      console.warn(
        "Web workers unavailable. Running pattern generator on UI thread."
      )
      getPlayablePattern().then((tetriminos) => {
        this.realStartGame(tetriminos)
      })
    }
  }

  private realStartGame(tetriminos: Tetrimino[]): void {
    const generatedTetrimino: Tetrimino[] = tetriminos.reverse()
    this._pendingTetriminos.push(...generatedTetrimino)

    this.spawnNextTetrimino()
    this.gameState = GameState.InProgress
    this.startDate = Date.now()
    this.onGameStart()
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
            this.realStartGame(fixedTetriminos)
          } else {
            console.warn(data)
          }
        }
      )
    }

    this._history = History.fromLocalStorage()
    this.endGame(false)
  }

  private updateFrozenBlocks(): void {
    for (let i = 0, len = this._frozenBlocks.length; i < len; i++) {
      const block = this._frozenBlocks[i]
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    }
  }

  private onGameStart(): void {
    this.emit("gamestart")
  }

  private onGameEnd(): void {
    this.emit("gameend")
  }

  private onBlockChanged(block: Block, disappeared: boolean): void {
    this.emit("blockchanged", new BlockChangedEventArgs(block, disappeared))
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

export { PeriotrisModel }
