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

import {
  DefaultBorderThickness,
  DefaultGameUpdateIntervalMilliseconds,
  isNil,
  SettingsLocalStorageKey,
} from "../../common"
import defaultColorScheme from "../../json/DefaultColorScheme.json"
import defaultMap from "../../json/DefaultMap.json"
import { retrieve, store } from "../../localstorage"

import type { IColorScheme } from "../color_scheme"
import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"
import type { IMap } from "../map"

/**
 * Settings for the app.
 */
export class Settings implements ILocalStorageSerializable {
  private _showGridLine: boolean | undefined
  public get showGridLine(): boolean {
    return this._showGridLine ?? true
  }
  public set showGridLine(v) {
    this._showGridLine = v
    this.toLocalStorage()
  }

  private _gameUpdateIntervalMilliseconds: number | undefined
  public get gameUpdateIntervalMilliseconds(): number {
    return (
      this._gameUpdateIntervalMilliseconds ??
      DefaultGameUpdateIntervalMilliseconds
    )
  }
  public set gameUpdateIntervalMilliseconds(v: number) {
    this._gameUpdateIntervalMilliseconds = v
    this.toLocalStorage()
  }

  private _gameMap: IMap | undefined
  public get gameMap(): IMap {
    return this._gameMap ?? defaultMap
  }
  public set gameMap(v) {
    this._gameMap = v
    this.toLocalStorage()
  }

  private _colorScheme: IColorScheme | undefined
  public get colorScheme(): IColorScheme {
    return this._colorScheme ?? defaultColorScheme
  }
  public set colorScheme(v) {
    this._colorScheme = v
    this.toLocalStorage()
  }

  private _borderThickness: number | undefined
  public get borderThickness(): number {
    return this._borderThickness ?? DefaultBorderThickness
  }
  public set borderThickness(v) {
    this._borderThickness = v
    this.toLocalStorage()
  }

  public clear(): void {
    this._showGridLine = undefined
    this._gameUpdateIntervalMilliseconds = undefined
    this._gameMap = undefined
    this._colorScheme = undefined
    this._borderThickness = undefined
  }

  private constructor() {
    this.clear()
  }

  public static fromLocalStorage(): Settings {
    const result = retrieve<Settings>(SettingsLocalStorageKey)

    if (isNil(result)) return Settings.Default

    return Object.create(
      Settings.prototype,
      Object.getOwnPropertyDescriptors(result)
    )
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
