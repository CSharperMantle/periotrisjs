import dayjs from "dayjs"
import { EventEmitter } from "events"
import _ from "lodash"
import PatternGeneratorWorker from "worker-loader!./generation/PatternGeneratorWorker"

import { isBrowserEnv } from "../common/IsBrowserEnv"
import { Nullable } from "../common/Nullable"
import { PlayAreaHeight, PlayAreaWidth } from "../common/PeriotrisConst"
import { Position } from "../common/Position"
import { History } from "../customization/history/History"
import defaultMap from "../json/DefaultMap.json"
import { Block } from "./Block"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "./Direction"
import { GameState } from "./GameState"
import { IGeneratorMessage } from "./generation/IGeneratorMessage"
import { MessageType } from "./generation/MessageType"
import { getPlayablePattern } from "./generation/PatternGenerator"
import { Tetrimino } from "./Tetrimino"

class PeriotrisModel extends EventEmitter {
  private readonly _frozenBlocks: Block[] = []
  private readonly _pendingTetriminos: Tetrimino[] = []
  private _activeTetrimino: Nullable<Tetrimino> = null
  private _history: History = null

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
      this.isNewRecord = this._history.add(dayjs(this.elapsedMilliseconds))
      History.toLocalStorage(this._history)
    }
  }

  public instantDropActiveTetrimino(): void {
    if (this.gameState !== GameState.InProgress) return
    this.updateActiveTetrimino(true)
    while (
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
    this._activeTetrimino.tryRotate(
      direction,
      this.checkBlockCollision.bind(this)
    )
    this.updateActiveTetrimino(false)
  }

  public prepareStartGame(): void {
    this._frozenBlocks.forEach((block: Block) => {
      this.onBlockChanged(block, true)
    })
    this._frozenBlocks.length = 0

    if (!_.isNil(this._activeTetrimino)) {
      this.updateActiveTetrimino(true)
      this._activeTetrimino = null
    }

    this.gameState = GameState.Preparing

    if (isBrowserEnv()) {
      // Use Web Worker
      const worker = new PatternGeneratorWorker()

      worker.onmessage = (eventArgs) => {
        const data = eventArgs.data as IGeneratorMessage
        if (data.type === MessageType.ResponseSuccess) {
          const content = data.content as Tetrimino[]
          const fixedTetriminos = this.repairBrokenTetriminos(content)
          this.realStartGame(fixedTetriminos)
          worker.terminate()
        } else {
          console.warn(data)
        }
      }

      const message: IGeneratorMessage = {
        type: MessageType.RequestGeneration,
        content: null,
      }
      worker.postMessage(message)
    } else {
      // Use single-threaded approach
      this.realStartGame(getPlayablePattern())
    }
  }

  private repairBrokenTetriminos(brokenTetriminos: Tetrimino[]): Tetrimino[] {
    /*
     * HACK: Object's prototype chain will be lost when
     * transferred through messages, thanks to the limitations
     * of structured clone. The following code's
     * purpose is to restore the method mapping of the
     * objects.
     */
    const repairedTetriminos: Tetrimino[] = Array.from(
      brokenTetriminos,
      (brokenTetrimino: Tetrimino) => {
        // Fix tetrimino itself
        const repairedTetrimino = Object.create(
          Tetrimino.prototype,
          Object.getOwnPropertyDescriptors(brokenTetrimino)
        ) as Tetrimino

        // Fix its block positions
        const repairedBlocks: Block[] = Array.from(
          repairedTetrimino.blocks,
          (block: Block) => {
            const repairedBlock = Object.create(
              Block.prototype,
              Object.getOwnPropertyDescriptors(block)
            ) as Block
            repairedBlock.position = Object.create(
              Position.prototype,
              Object.getOwnPropertyDescriptors(repairedBlock.position)
            ) as Position
            return repairedBlock
          }
        )
        repairedTetrimino.blocks = repairedBlocks

        // Fix its own positions
        repairedTetrimino.firstBlockPosition = Object.create(
          Position.prototype,
          Object.getOwnPropertyDescriptors(repairedTetrimino.firstBlockPosition)
        ) as Position
        repairedTetrimino.position = Object.create(
          Position.prototype,
          Object.getOwnPropertyDescriptors(repairedTetrimino.position)
        ) as Position

        return repairedTetrimino
      }
    )
    return repairedTetriminos
  }

  private realStartGame(tetriminos: Tetrimino[]): void {
    const generatedTetrimino: Tetrimino[] = tetriminos.reverse()
    generatedTetrimino.forEach((tetrimino: Tetrimino) => {
      this._pendingTetriminos.push(tetrimino)
    })

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
    this._frozenBlocks.forEach((block: Block) => {
      if (
        defaultMap.periodicTable[block.position.Y][block.position.X]
          .atomicNumber !== block.atomicNumber
      ) {
        this.endGame(false)
      }
    })

    if (this._frozenBlocks.length >= defaultMap.totalAvailableBlocksCount) {
      this.endGame(true)
    }
  }

  public constructor() {
    super()
    this._history = History.fromLocalStorage()
    this.endGame(false)
  }

  private updateFrozenBlocks(): void {
    this._frozenBlocks.forEach((block: Block) => {
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    })
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
    if (block.position.X < 0 || block.position.X >= PlayAreaWidth) {
      return true
    }
    if (block.position.Y >= PlayAreaHeight) {
      return true
    }
    return _.some(this._frozenBlocks, (frozenBlock: Block): boolean => {
      return frozenBlock.position.equals(block.position)
    })
  }

  private freezeActiveTetrimino(): void {
    if (_.isNil(this._activeTetrimino)) {
      console.warn("PeriotrisModel.freezeActiveTetrimino() null check")
      return
    }
    this._activeTetrimino.blocks.forEach((block: Block) => {
      this._frozenBlocks.push(block)
    })
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
      this._activeTetrimino.blocks.forEach((block: Block) => {
        this.onBlockChanged(block, disappeared)
      })
    }
  }
}

export { PeriotrisModel }
