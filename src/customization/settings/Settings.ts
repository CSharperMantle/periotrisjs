import _ from "lodash"

import {
  GameUpdateIntervalMilliseconds,
  SettingsLocalStorageKey,
} from "../../common"
import { retrieve, store } from "../../localstorage"

import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"
import type { IMap } from "../map"

import defaultMap from "../../json/DefaultMap.json"

/**
 * Settings for the app.
 */
class Settings implements ILocalStorageSerializable {
  private _showGridLine = true
  public get showGridLine(): boolean {
    return this._showGridLine
  }
  public set showGridLine(v: boolean) {
    this._showGridLine = v
    this.toLocalStorage()
  }

  private _gameUpdateIntervalMilliseconds = GameUpdateIntervalMilliseconds
  public get gameUpdateIntervalMilliseconds(): number {
    return this._gameUpdateIntervalMilliseconds
  }
  public set gameUpdateIntervalMilliseconds(v: number) {
    this._gameUpdateIntervalMilliseconds = v
    this.toLocalStorage()
  }

  private _gameMap: IMap = defaultMap
  public get gameMap(): IMap {
    return this._gameMap
  }
  public set gameMap(v: IMap) {
    this._gameMap = v
    this.toLocalStorage()
  }

  public static fromLocalStorage(): Settings {
    const result = retrieve(SettingsLocalStorageKey)

    if (_.isNil(result)) return new Settings()

    const repairedSettings = Object.create(
      Settings.prototype,
      Object.getOwnPropertyDescriptors(result)
    ) as Settings
    return repairedSettings
  }

  /**
   * Write the Settings object to local storage.
   *
   * Note: You will hardly need to call this method because modifications
   * to the Settings object will be automatically persisted.
   */
  public toLocalStorage(): void {
    store(SettingsLocalStorageKey, this)
  }
}

export { Settings }
