import dayjs, { Dayjs } from "dayjs"
import _ from "lodash"

import { HistoryLocalStorageKey } from "../../common"
import { retrieve, store } from "../../localstorage"

import type { ILocalStorageSerializable } from "../ILocalStorageSerializable"

class History implements ILocalStorageSerializable {
  private _fastestRecord: Dayjs | null
  public get fastestRecord(): Dayjs | null {
    return this._fastestRecord
  }
  private set fastestRecord(v: Dayjs | null) {
    this._fastestRecord = v
  }

  private _records: Dayjs[]
  public get records(): Dayjs[] {
    return this._records
  }
  private set records(v: Dayjs[]) {
    this._records = v
  }

  public add(v: Dayjs): boolean {
    this.records.push(v)
    let isFastestRecordUpdated = false
    if (_.isNil(this.fastestRecord) || this.fastestRecord.diff(v) > 0) {
      this.fastestRecord = v
      isFastestRecordUpdated = true
    }
    this.toLocalStorage()
    return isFastestRecordUpdated
  }

  /**
   * Note: For testing only. Do not use in user code.
   */
  public constructor() {
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
    repairedHistory.fastestRecord = dayjs(repairedHistory.fastestRecord)
    repairedHistory.records = Array.from(
      repairedHistory.records,
      (record: Dayjs) => dayjs(record)
    )
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
}

export { History }
