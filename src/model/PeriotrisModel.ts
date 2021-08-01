import { Block } from "./Block"
import { Tetrimino, BlockCollisionChecker } from "./Tetrimino"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import _ from "lodash"
import { MoveDirection, RotationDirection } from "./Direction"
import { PlayAreaWidth, PlayAreaHeight } from "../common/PeriotrisConst"
import { getPlayablePattern } from "./generation/PatternGenerator"
import defaultMap from "../json/DefaultMap.json"
import { Nullable } from "../common/Nullable"
import { GameState } from "./GameState"

class PeriotrisModel extends EventTarget {
  private readonly _frozenBlocks: Block[] = []
  private readonly _pendingTetriminos: Tetrimino[] = []
  private _activeTetrimino: Nullable<Tetrimino> = null

  private _gameState: GameState = GameState.NotStarted
  public get gameState(): GameState {
    return this._gameState
  }
  public set gameState(v: GameState) {
    this._gameState = v
  }

  private endGame(victory: boolean): void {
    if (victory) {
      this.gameState = GameState.Won
    } else {
      this.gameState = GameState.Lost
    }
    this._pendingTetriminos.length = 0
    this.onGameEnd()
  }

  public instantDropActiveTetrimino(): void {
    if (this.gameState !== GameState.InProgress) return
    this.updateActiveTetrimino(true)
    while (
      this._activeTetrimino!.tryMove(
        MoveDirection.Down,
        PeriotrisModel.checkBlockCollisionFunFactory(this)
      )
    ) {}
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
          PeriotrisModel.checkBlockCollisionFunFactory(this)
        )
      ) {
        this.freezeActiveTetrimino()
        this.updateActiveTetrimino(false)
        this.spawnNextTetrimino()
      }
    } else {
      this._activeTetrimino.tryMove(
        direction,
        PeriotrisModel.checkBlockCollisionFunFactory(this)
      )
    }
    this.updateActiveTetrimino(false)
  }

  public rotateActiveTetrimino(direction: RotationDirection): void {
    if (this.gameState !== GameState.InProgress) {
      return
    }

    this.updateActiveTetrimino(true)
    this._activeTetrimino!.tryRotate(
      direction,
      PeriotrisModel.checkBlockCollisionFunFactory(this)
    )
    this.updateActiveTetrimino(false)
  }

  public startGame(): void {
    this._frozenBlocks.forEach((block: Block) => {
      this.onBlockChanged(block, true)
    })
    this._frozenBlocks.length = 0

    if (!_.isNil(this._activeTetrimino)) {
      this.updateActiveTetrimino(true)
      this._activeTetrimino = null
    }

    this.gameState = GameState.Preparing
    const generatedTetrimino: Tetrimino[] = getPlayablePattern().reverse()
    generatedTetrimino.forEach((tetrimino: Tetrimino) => {
      this._pendingTetriminos.push(tetrimino)
    })

    this.spawnNextTetrimino()
    this.gameState = GameState.InProgress
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
    this.endGame(false)
  }

  private updateFrozenBlocks(): void {
    this._frozenBlocks.forEach((block: Block) => {
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    })
  }

  private onGameEnd(): void {
    this.dispatchEvent(new Event("gameend"))
  }

  private onBlockChanged(block: Block, disappeared: boolean): void {
    this.dispatchEvent(
      new CustomEvent("blockchanged", {
        detail: new BlockChangedEventArgs(block, disappeared),
      })
    )
  }

  private static checkBlockCollisionFunFactory(
    that: PeriotrisModel
  ): BlockCollisionChecker {
    return (block: Block): boolean => {
      if (block.position.X < 0 || block.position.X >= PlayAreaWidth) {
        return true
      }
      if (block.position.Y >= PlayAreaHeight) {
        return true
      }
      return _.some(that._frozenBlocks, (frozenBlock: Block): boolean =>
        frozenBlock.position.equals(block.position)
      )
    }
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
