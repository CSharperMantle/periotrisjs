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
import { retrieve, store } from "../../localstorage"

import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"

export class History implements ILocalStorageSerializable {
  private _fastestRecord: number | null | undefined
  public get fastestRecord(): number | null {
    return this._fastestRecord ?? null
  }
  private set fastestRecord(v: number | null) {
    this._fastestRecord = v
  }

  private _records: number[] | undefined
  public get records(): number[] {
    return this._records ?? []
  }
  private set records(v: number[]) {
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

  private constructor() {
    this._fastestRecord = null
    this._records = []
  }

  public static fromLocalStorage(): History {
    const result = retrieve(HistoryLocalStorageKey)

    if (isNil(result)) return new History()

    const repairedHistory = Object.create(
      History.prototype,
      Object.getOwnPropertyDescriptors(result)
    ) as History
    return repairedHistory
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
