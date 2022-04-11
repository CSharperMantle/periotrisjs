import _ from "lodash"

import {
  DefaultBorderThickness,
  DefaultGameUpdateIntervalMilliseconds,
  SettingsLocalStorageKey,
} from "../../common"
import defaultColorScheme from "../../json/DefaultColorScheme.json"
import defaultMap from "../../json/DefaultMap.json"
import { retrieve, store } from "../../localstorage"
import { IColorScheme } from "../color_scheme"

import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"
import type { IMap } from "../map"

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

  private _gameUpdateIntervalMilliseconds =
    DefaultGameUpdateIntervalMilliseconds
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

  private _colorScheme: IColorScheme = defaultColorScheme
  public get colorScheme(): IColorScheme {
    return this._colorScheme
  }
  public set colorScheme(v: IColorScheme) {
    this._colorScheme = v
    this.toLocalStorage()
  }

  private _borderThickness: number = DefaultBorderThickness
  public get borderThickness(): number {
    return this._borderThickness
  }
  public set borderThickness(v: number) {
    this._borderThickness = v
    this.toLocalStorage()
  }

  private constructor() {
    // Do nothing.
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

  /**
   * Get default settings.
   */
  public static get Default(): Settings {
    return new Settings()
  }
}

export { Settings }
