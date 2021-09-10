import { retrieve, store } from "../LocalStorageManager"

describe("LocalStorageManager", () => {
  it("should retrieve objects in JSON from window.localStorage", () => {
    const getItemSpy = jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation((key: unknown): string | null => {
        expect(key as string).toBe("__test_item")

        return `{ "testProp": 1 }`
      })

    const obj = retrieve("__test_item") as { testProp: number }

    expect(getItemSpy).toBeCalledTimes(1)
    expect(obj.testProp).toBe(1)

    getItemSpy.mockReset()
  })

  it("should store objects in JSON to window.localStorage", () => {
    const setItemSpy = jest
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementation((key: unknown, value: unknown): void => {
        expect(key as string).toBe("__test_item")
        expect(JSON.parse(value as string).testProp).toBe(2)
      })

    store("__test_item", { testProp: 2 })

    expect(setItemSpy).toBeCalledTimes(1)

    setItemSpy.mockReset()
  })

  it("should handle non-existent keys gracefully when retrieving", () => {
    const getItemSpy = jest
      .spyOn(window.localStorage.__proto__, "getItem")
      .mockImplementation((): string | null => {
        return null
      })

    const obj = retrieve("__missing_test_item")

    expect(getItemSpy).toBeCalledTimes(1)
    expect(obj).toBeNull()

    getItemSpy.mockReset()
  })
})
