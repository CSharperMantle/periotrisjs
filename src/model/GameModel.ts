/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { EventEmitter } from "events"
import { isBrowser } from "is-in-browser"
import { isEqual, range } from "lodash"

import { isNil, waitForEvent } from "../common"
import { customizationFacade } from "../customization"
import { Block } from "./Block"
import { MoveDirection, RotationDirection } from "./Direction"
import { GameState } from "./GameState"
import { getPlayablePattern, MessageType } from "./generation"
import { repairBrokenTetriminos, Tetrimino } from "./Tetrimino"

import type { IGeneratorMessage } from "./generation"

async function generatePattern(): Promise<Tetrimino[]> {
  if (!isBrowser) {
    return await getPlayablePattern(customizationFacade.settings.gameMap)
  }
  const workers = range(0, navigator.hardwareConcurrency).map(
    (i) =>
      new Worker(
        new URL("./generation/PatternGeneratorWorker", import.meta.url),
        {
          name: `PatternGeneratorWorker-${i}`,
        }
      )
  )
  const workerPromises = workers.map((w) =>
    waitForEvent<MessageEvent<IGeneratorMessage<unknown>>>(
      w,
      "message",
      "error"
    )
  )
  workers.forEach((w) => {
    w.postMessage({
      type: MessageType.RequestGeneration,
      content: customizationFacade.settings.gameMap,
    })
  })
  const result = (await Promise.race(workerPromises)).data
  workers.forEach((w) => {
    w.terminate()
  })
  return result.content as Tetrimino[]
}

/**
 * The model of Periotris.
 *
 * @emits gamestarted
 * @emits gameended
 * @emits blockschanged
 * @emits gamestatechanged
 */
export class GameModel extends EventEmitter {
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
  private set gameState(v) {
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
    if (this.gameState !== GameState.NotStarted) {
      if (victory) {
        this._isNewHighRecord = customizationFacade.history.add(
          this.elapsedMilliseconds
        )
        this.gameState = GameState.Won
      } else {
        this.gameState = GameState.Lost
      }
    }
    this._pendingTetriminos.length = 0
    this._endDate = Date.now()
    this.onGameEnded()
  }

  /**
   * Move the tetrimino down as far as possible.
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
      !isNil(this._activeTetrimino) &&
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
      isNil(this._activeTetrimino)
    ) {
      return
    }

    this.updateActiveTetrimino(true)
    const isMoveSuccessful = this._activeTetrimino.tryMove(
      direction,
      this.checkBlockValidity.bind(this)
    )
    if (direction === MoveDirection.Down && !isMoveSuccessful) {
      this.freezeActiveTetrimino()
      this.updateActiveTetrimino(false)
      this.spawnNextTetrimino()
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
    if (this.gameState !== GameState.InProgress) {
      return
    }

    this.updateActiveTetrimino(true)
    this._activeTetrimino?.tryRotate(
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
  public async prepareGame(): Promise<void> {
    this.onBlocksChanged(this._frozenBlocks, true)
    this._frozenBlocks.length = 0

    this.updateActiveTetrimino(true)
    this._activeTetrimino = null

    this.gameState = GameState.Preparing
    const tetriminos = repairBrokenTetriminos(await generatePattern())
    this.startPreparedGame(tetriminos)
  }

  /**
   * Start the game with a set of tetriminos.
   *
   * @param tetriminos The tetriminos to start the game with.
   */
  private startPreparedGame(tetriminos: Tetrimino[]): void {
    const generatedTetrimino = tetriminos.reverse()
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

    const map = customizationFacade.settings.gameMap.map
    if (
      this._frozenBlocks.some(
        (block) =>
          map[block.position[1]][block.position[0]].atomicNumber !==
          block.atomicNumber
      )
    ) {
      // The player made a mistake, so end the game.
      this.endGame(false)
      return
    }

    if (
      this._frozenBlocks.length >=
      customizationFacade.settings.gameMap.totalAvailableBlocksCount
    ) {
      // The player won.
      this.endGame(true)
    }
    // Otherwise, the game continues.
  }

  /**
   * Create a new instance of {@link GameModel}.
   */
  public constructor() {
    super()
    this.endGame(false)
  }

  /**
   * Refresh all frozen blocks.
   *
   * This method works by removing and re-adding all frozen blocks.
   */
  private updateFrozenBlocks(): void {
    this.onBlocksChanged(this._frozenBlocks, true)
    this.onBlocksChanged(this._frozenBlocks, false)
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
   * Emit the event blockschanged.
   *
   * This event informs the subscribers that state of some blocks has changed.
   *
   * @param blocks The blocks to update.
   * @param disappeared Whether the block disappeared.
   */
  private onBlocksChanged(blocks: Block[], disappeared: boolean): void {
    this.emit("blockschanged", { blocks, disappeared })
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
    const width = customizationFacade.settings.gameMap.playAreaSize.width
    const height = customizationFacade.settings.gameMap.playAreaSize.height
    if (block.position[0] < 0 || block.position[0] >= width) {
      return true
    }
    if (block.position[1] >= height) {
      return true
    }
    return this._frozenBlocks.some((frozenBlock) =>
      isEqual(frozenBlock.position, block.position)
    )
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
    this._frozenBlocks.push(...(this._activeTetrimino?.blocks ?? []))
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
      // We are certain that we have something to pop.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._activeTetrimino = this._pendingTetriminos.pop()!
      this.updateActiveTetrimino(false)
    }
  }

  /**
   * Update the active tetrimino.
   *
   * This method updates all the blocks of {@link _activeTetrimino}.
   *
   * This method has no effect if {@link _activeTetrimino} is `null`.
   *
   * @param disappeared Whether the tetrimino disappeared.
   */
  private updateActiveTetrimino(disappeared: boolean): void {
    if (!isNil(this._activeTetrimino)) {
      this.onBlocksChanged(this._activeTetrimino.blocks, disappeared)
    }
  }
}
