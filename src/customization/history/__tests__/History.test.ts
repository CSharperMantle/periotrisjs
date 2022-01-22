import dayjs from "dayjs"
import { History } from "../History"

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
})
