import dayjs from "dayjs"

import { HistoryLocalStorageKey } from "../../../common"
import { retrieve, store } from "../../../localstorage"
import { History } from "../History"

jest.mock("../../../localstorage", () => ({
  __esModule: true,
  store: jest.fn(),
  retrieve: jest.fn(),
}))

describe("History", () => {
  it("should be initialized empty", () => {
    const h = new History()

    expect(h.fastestRecord).toBeNull()
    expect(h.records).toHaveLength(0)
  })

  it("should be able to track records", () => {
    const h = new History()

    expect(h.records).toHaveLength(0)
    h.add(dayjs(1000))
    h.add(dayjs(2000))
    expect(h.records).toHaveLength(2)
  })

  it("should update fastest record when necessary", () => {
    const h = new History()

    expect(h.fastestRecord).toBeNull()
    expect(h.add(dayjs(2000))).toBeTruthy()
    expect(h.fastestRecord).toEqual(dayjs(2000))
    expect(h.add(dayjs(1000))).toBeTruthy()
    expect(h.fastestRecord).toEqual(dayjs(1000))
    expect(h.add(dayjs(3000))).toBeFalsy()
    expect(h.fastestRecord).toEqual(dayjs(1000))
  })

  it("should interact with LocalStorage gracefully", () => {
    const mockedRetrieve = retrieve as jest.Mock<unknown, [string]>
    mockedRetrieve.mockImplementationOnce((key: string) => {
      expect(key).toBe(HistoryLocalStorageKey)
      return null
    })
    const mockedStore = store as jest.Mock<boolean, [string, History]>
    mockedStore.mockImplementationOnce((key: string, object: History) => {
      expect(key).toBe(HistoryLocalStorageKey)
      expect(object).toBeInstanceOf(History)
      expect((object as History).records).toHaveLength(0)
      expect((object as History).fastestRecord).toBeNull()
      return true
    })

    const h = History.fromLocalStorage()
    expect(mockedRetrieve).toBeCalledTimes(1)
    h.toLocalStorage()
    expect(mockedStore).toBeCalledTimes(1)
  })
})
