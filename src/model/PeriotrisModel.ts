import { Block } from "./Block"
import { Tetrimino, BlockCollisionChecker } from "./Tetrimino"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import _ from "lodash"
import { MoveDirection, RotationDirection } from "./Direction"
import { PlayAreaWidth, PlayAreaHeight } from "../common/PeriotrisConst"
import { getPlayablePattern } from "./generation/PatternGenerator"
import defaultPeriodicTable from "./generation/DefaultPeriodicTable.json"

class PeriotrisModel extends EventTarget {
  private readonly _frozenBlocks: Block[] = []
  private readonly _pendingTetriminos: Tetrimino[] = []
  private _startTime: Date = null
  private _activeTetrimino: Tetrimino = null

  private _gameEnded: boolean = true
  public get gameEnded(): boolean {
    return this._gameEnded
  }
  public set gameEnded(v: boolean) {
    this._gameEnded = v
  }

  private _victory: boolean = false
  public get victory(): boolean {
    return this._victory
  }
  public set victory(v: boolean) {
    this._victory = v
  }

  private endGame(victory: boolean): void {
    this.gameEnded = true
    this.victory = victory
    this._pendingTetriminos.length = 0
    this.onGameEnd()
  }

  public instantDropActiveTetrimino(): void {
    if (this.gameEnded) return
    this.updateActiveTetrimino(true)
    while (
      this._activeTetrimino.tryMove(
        MoveDirection.Down,
        PeriotrisModel.checkBlockCollisionFunFactory(this)
      )
    ) {}
    this.updateActiveTetrimino(false)
  }

  public moveActiveTetrimino(direction: MoveDirection): void {
    if (this.gameEnded || _.isNil(this._activeTetrimino)) {
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
    if (this.gameEnded) {
      return
    }

    this.updateActiveTetrimino(true)
    this._activeTetrimino.tryRotate(
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

    const generatedTetrimino: Tetrimino[] = getPlayablePattern().reverse()
    generatedTetrimino.forEach((tetrimino: Tetrimino) => {
      this._pendingTetriminos.push(tetrimino)
    })

    this.spawnNextTetrimino()
    this.gameEnded = false
  }

  public update(): void {
    if (this.gameEnded) {
      return
    }

    this.moveActiveTetrimino(MoveDirection.Down)
    this._frozenBlocks.forEach((block: Block) => {
      if (
        defaultPeriodicTable.periodicTable[block.position.Y][block.position.X]
          .atomicNumber !== block.atomicNumber
      ) {
        this.endGame(false)
      }
    })

    if (
      this._frozenBlocks.length >=
      defaultPeriodicTable.totalAvailableBlocksCount
    ) {
      this.endGame(true)
    }
  }

  public updateAllBlocks(): void {
    this.updateActiveTetrimino(true)
    this.updateActiveTetrimino(false)
    this._frozenBlocks.forEach((block: Block) => {
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    })
  }

  public constructor() {
    super()
    this.endGame(false)
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
    return (block: Block) => {
      if (block.position.X < 0 || block.position.X >= PlayAreaWidth) {
        return true
      }
      if (block.position.Y >= PlayAreaHeight) {
        return true
      }
      return _.some(that._frozenBlocks, (frozenBlock: Block) => {
        frozenBlock.position.equals(block.position)
      })
    }
  }

  private freezeActiveTetrimino(): void {
    this._activeTetrimino.blocks.forEach((block: Block) => {
      this._frozenBlocks.push(block)
    })
  }

  private spawnNextTetrimino(): void {
    if (this._pendingTetriminos.length > 0) {
      this._activeTetrimino = this._pendingTetriminos.pop()
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
