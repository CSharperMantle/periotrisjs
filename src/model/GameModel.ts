import dayjs from "dayjs"
import { EventEmitter } from "events"
import { isBrowser } from "is-in-browser"
import _ from "lodash"

import { positionEquals } from "../common"
import { customizationFacade } from "../customization"
import { Block } from "./Block"
import { BlockChangedEventArgs } from "./BlockChangedEventArgs"
import { MoveDirection, RotationDirection } from "./Direction"
import { GameState } from "./GameState"
import { getPlayablePattern, MessageType } from "./generation"
import { repairBrokenTetriminos, Tetrimino } from "./Tetrimino"

import type { IGeneratorMessage } from "./generation"
import type { IMap } from "../customization"

/**
 * The model of Periotris.
 *
 * @emits `gamestarted`
 * @emits `gameended`
 * @emits `blockchanged`
 * @emits `gamestatechanged`
 */
export class GameModel extends EventEmitter {
  /**
   * Pattern generator thread.
   */
  private readonly _patternGeneratorWorker = isBrowser
    ? new Worker(
        new URL("./generation/PatternGeneratorWorker", import.meta.url)
      )
    : null

  /**
   * "Frozen" blocks, that is, blocks that are fallen and not movable.
   */
  private readonly _frozenBlocks: Block[] = []

  /**
   * Tetriminos yet to be spawned.
   */
  private readonly _pendingTetriminos: Tetrimino[] = []

  /**
   * "Active" tetrimino, that is, a tetrimino that is currently falling.
   * and controllable by the player.
   */
  private _activeTetrimino: Tetrimino | null = null

  private _gameState: GameState = GameState.NotStarted
  /**
   * The state of the game.
   *
   * @see {@link GameState}
   */
  public get gameState(): GameState {
    return this._gameState
  }
  private set gameState(v: GameState) {
    this._gameState = v
    this.onGameStateChanged()
  }

  private _isNewHighRecord = false
  /**
   * Whether the user has created a new high record.
   */
  public get isNewHighRecord(): boolean {
    return this._isNewHighRecord
  }

  /**
   * Starting time of the game.
   */
  private _startDate = Date.now()

  /**
   * Ending time of the game.
   */
  private _endDate = Date.now()

  /**
   * Elapsed time of the game in milliseconds.
   */
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

  /**
   * End the game.
   *
   * This method is called when the game is lost or won. It sets the game state
   * according to the parameter, updates timers, clears the pending tetriminos
   * and emits appropriate events.
   *
   * @param victory Whether the game is won.
   */
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
      this._isNewHighRecord = customizationFacade.history.add(
        dayjs(this.elapsedMilliseconds)
      )
    }
  }

  /**
   * Instantly fix the active tetrimino to bottom.
   *
   * This method has no effect if the game state is not {@link GameState.InProgress}.
   *
   * @see {@link GameState}
   * @see {@link gameState}
   */
  public instantDropActiveTetrimino(): void {
    if (this.gameState !== GameState.InProgress) return
    this.updateActiveTetrimino(true)
    while (
      !_.isNil(this._activeTetrimino) &&
      this._activeTetrimino.tryMove(
        MoveDirection.Down,
        this.checkBlockValidity.bind(this)
      )
    );
    this.updateActiveTetrimino(false)
  }

  /**
   * Move the active tetrimino.
   *
   * This method has no effect if the game state is not {@link GameState.InProgress}.
   *
   * @param direction The direction to move the active tetrimino.
   */
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
          this.checkBlockValidity.bind(this)
        )
      ) {
        this.freezeActiveTetrimino()
        this.updateActiveTetrimino(false)
        this.spawnNextTetrimino()
      }
    } else {
      this._activeTetrimino.tryMove(
        direction,
        this.checkBlockValidity.bind(this)
      )
    }
    this.updateActiveTetrimino(false)
  }

  /**
   * Rotate the active tetrimino.
   *
   * This method has no effect if the game state is not {@link GameState.InProgress}.
   *
   * @param direction The direction to rotate the active tetrimino.
   */
  public rotateActiveTetrimino(direction: RotationDirection): void {
    if (
      this.gameState !== GameState.InProgress ||
      _.isNil(this._activeTetrimino)
    ) {
      return
    }

    this.updateActiveTetrimino(true)
    this._activeTetrimino.tryRotate(
      direction,
      this.checkBlockValidity.bind(this)
    )
    this.updateActiveTetrimino(false)
  }

  /**
   * Prepare the game and start it.
   *
   * This method generates the tetrimino pattern and starts the game.
   *
   * @see {@link startPreparedGame}
   */
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

    if (!_.isNil(this._patternGeneratorWorker)) {
      // We have workers.
      const message: IGeneratorMessage<IMap> = {
        type: MessageType.RequestGeneration,
        content: customizationFacade.settings.gameMap,
      }
      this._patternGeneratorWorker.postMessage(message)
    } else {
      console.warn(
        "Web workers unavailable. Running pattern generator on UI thread."
      )
      getPlayablePattern(customizationFacade.settings.gameMap).then(
        (tetriminos) => {
          this.startPreparedGame(tetriminos)
        }
      )
    }
  }

  /**
   * Start the game with a set of tetriminos.
   *
   * @param tetriminos The tetriminos to start the game with.
   */
  private startPreparedGame(tetriminos: Tetrimino[]): void {
    const generatedTetrimino: Tetrimino[] = tetriminos.reverse()
    this._pendingTetriminos.push(...generatedTetrimino)

    this.spawnNextTetrimino()
    this.gameState = GameState.InProgress
    this._startDate = Date.now()
    this.onGameStarted()
  }

  /**
   * Forward the game by one tick.
   */
  public update(): void {
    if (this.gameState !== GameState.InProgress) {
      return
    }

    this.moveActiveTetrimino(MoveDirection.Down)

    if (
      this._frozenBlocks.some(
        (block) =>
          customizationFacade.settings.gameMap.map[block.position.y][
            block.position.x
          ].atomicNumber !== block.atomicNumber
      )
    ) {
      // The player made a mistake, so end the game.
      this.endGame(false)
    } else {
      if (
        this._frozenBlocks.length >=
        customizationFacade.settings.gameMap.totalAvailableBlocksCount
      ) {
        // The player won.
        this.endGame(true)
      }
      // Otherwise, the game continues.
    }
  }

  /**
   * Create a new instance of {@link GameModel}.
   */
  public constructor() {
    super()

    if (!_.isNil(this._patternGeneratorWorker)) {
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

  /**
   * Refresh all frozen blocks.
   *
   * This method works by removing and re-adding all frozen blocks.
   */
  private updateFrozenBlocks(): void {
    for (let i = 0, len = this._frozenBlocks.length; i < len; i++) {
      const block = this._frozenBlocks[i]
      this.onBlockChanged(block, true)
      this.onBlockChanged(block, false)
    }
  }

  /**
   * Emit the event gamestarted.
   *
   * This event informs the subscribers that the game has started.
   */
  private onGameStarted(): void {
    this.emit("gamestarted")
  }

  /**
   * Emit the event gameended.
   *
   * This event informs the subscribers that the game has ended.
   */
  private onGameEnded(): void {
    this.emit("gameended")
  }

  /**
   * Emit the event blockchanged.
   *
   * This event informs the subscribers that a block has changed.
   *
   * @param block The block to update.
   * @param disappeared Whether the block disappeared.
   */
  private onBlockChanged(block: Block, disappeared: boolean): void {
    this.emit("blockchanged", new BlockChangedEventArgs(block, disappeared))
  }

  /**
   * Emit the event gamestatechanged.
   *
   * This event informs the subscribers that the game state has changed.
   */
  private onGameStateChanged(): void {
    this.emit("gamestatechanged")
  }

  /**
   * Helper function to check if a block is valid, that is, it does
   * not collide with any other block in {@link _frozenBlocks} and
   * does not locate outside the game area.
   *
   * @param block The block to check.
   * @returns Whether the block is valid.
   */
  private checkBlockValidity(block: Block): boolean {
    if (
      block.position.x < 0 ||
      block.position.x >=
        customizationFacade.settings.gameMap.playAreaSize.width
    ) {
      return true
    }
    if (
      block.position.y >=
      customizationFacade.settings.gameMap.playAreaSize.height
    ) {
      return true
    }
    return this._frozenBlocks.some((frozenBlock: Block): boolean => {
      return positionEquals(frozenBlock.position, block.position)
    })
  }

  /**
   * Freeze the active tetrimino.
   *
   * This method moves all the blocks of {@link _activeTetrimino} to
   * {@link _frozenBlocks}.
   *
   * This method has no effect if {@link _activeTetrimino} is `null`.
   */
  private freezeActiveTetrimino(): void {
    if (_.isNil(this._activeTetrimino)) {
      return
    }
    this._frozenBlocks.push(...this._activeTetrimino.blocks)
    this.updateFrozenBlocks()
  }

  /**
   * Spawn a new tetrimino.
   *
   * This method pops a tetrimino from {@link _pendingTetriminos}. It
   * does not freeze the previous {@link _activeTetrimino}.
   *
   * This method has no effect if {@link _pendingTetriminos} is empty.
   *
   * @see {@link freezeActiveTetrimino}
   */
  private spawnNextTetrimino(): void {
    if (this._pendingTetriminos.length > 0) {
      const poppedTetrimino = this._pendingTetriminos.pop()
      if (!_.isNil(poppedTetrimino)) {
        this._activeTetrimino = poppedTetrimino
      } else {
        return
      }
      this.updateActiveTetrimino(false)
    }
  }

  /**
   * Update the active tetrimino.
   *
   * This method iterates over all the blocks of {@link _activeTetrimino}
   * and updates them.
   *
   * This method has no effect if {@link _activeTetrimino} is `null`.
   *
   * @param disappeared Whether the tetrimino disappeared.
   */
  private updateActiveTetrimino(disappeared: boolean): void {
    if (_.isNil(this._activeTetrimino)) {
      return
    }

    for (let i = 0, len = this._activeTetrimino.blocks.length; i < len; i++) {
      const block = this._activeTetrimino.blocks[i]
      this.onBlockChanged(block, disappeared)
    }
  }
}
