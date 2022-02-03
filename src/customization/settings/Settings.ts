import _ from "lodash"

import { SettingsLocalStorageKey } from "../../common"
import { retrieve, store } from "../../localstorage"

/**
 * Settings for the app.
 */
class Settings {
  private _showGridLine = true
  public get showGridLine(): boolean {
    return this._showGridLine
  }
  public set showGridLine(v: boolean) {
    this._showGridLine = v
    this.toLocalStorage()
  }

  private _gameUpdateIntervalMillisecond = 1000
  public get gameUpdateIntervalMillisecond(): number {
    return this._gameUpdateIntervalMillisecond
  }
  public set gameUpdateIntervalMillisecond(v: number) {
    this._gameUpdateIntervalMillisecond = v
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
