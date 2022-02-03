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

  private _gameUpdateIntervalMilliseconds = 1000
  public get gameUpdateIntervalMilliseconds(): number {
    return this._gameUpdateIntervalMilliseconds
  }
  public set gameUpdateIntervalMilliseconds(v: number) {
    this._gameUpdateIntervalMilliseconds = v
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
