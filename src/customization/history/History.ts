import _ from "lodash"

import { HistoryLocalStorageKey } from "../../common"
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
    if (_.isNil(this.fastestRecord) || v < this.fastestRecord) {
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

    if (_.isNil(result)) return new History()

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
