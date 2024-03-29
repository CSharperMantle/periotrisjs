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

import { HistoryLocalStorageKey, isNil } from "../../common"
import { remove, retrieve, store } from "../../localstorage"

import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"

export class History implements ILocalStorageSerializable {
  private _fastestRecord: number | null | undefined = undefined
  public get fastestRecord(): number | null {
    return this._fastestRecord ?? null
  }
  private set fastestRecord(v) {
    this._fastestRecord = v
  }

  private _records: number[] | undefined
  public get records(): number[] {
    return this._records ?? (this._records = []) // Initialize this._records if empty
  }
  private set records(v) {
    this._records = v
  }

  public add(v: number): boolean {
    this.records.push(v)
    let isFastestRecordUpdated = false
    if (isNil(this.fastestRecord) || v < this.fastestRecord) {
      this.fastestRecord = v
      isFastestRecordUpdated = true
    }
    this.toLocalStorage()
    return isFastestRecordUpdated
  }

  public clear(): void {
    Object.defineProperties(
      this,
      Object.getOwnPropertyDescriptors(History.Empty)
    )
    remove(HistoryLocalStorageKey)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static fromLocalStorage(): History {
    const result = retrieve<History>(HistoryLocalStorageKey)

    if (isNil(result)) return History.Empty

    return Object.create(
      History.prototype,
      Object.getOwnPropertyDescriptors(result)
    )
  }

  /**
   * Write the History object to local storage.
   *
   * Note: You will hardly need to call this method because modifications
   * to the History object will be automatically persisted.
   */
  public toLocalStorage(): void {
    store(HistoryLocalStorageKey, this)
  }

  /**
   * Get an empty History object.
   */
  public static get Empty(): History {
    return new History()
  }
}
