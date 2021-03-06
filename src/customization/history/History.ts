import dayjs, { Dayjs } from "dayjs"
import _ from "lodash"

import { HistoryLocalStorageKey } from "../../common/PeriotrisConst"
import { retrieve, store } from "../../localstorage/LocalStorageManager"

class History {
  private _fastestRecord: Dayjs
  public get fastestRecord(): Dayjs {
    return this._fastestRecord
  }
  private set fastestRecord(v: Dayjs) {
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
    if (_.isNil(this.fastestRecord) || this.fastestRecord.diff(v) > 0) {
      this.fastestRecord = v
      return true
    }
    return false
  }

  public constructor() {
    this._fastestRecord = dayjs(0)
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

  public static toLocalStorage(v: History): void {
    store(HistoryLocalStorageKey, v)
  }
}

export { History }
