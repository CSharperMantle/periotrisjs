import { isBrowser } from "is-in-browser"
import _ from "lodash"

export function store<T = unknown>(key: string, value: T): boolean {
  if (!isBrowser) return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (err: unknown) {
    console.warn(err)
    return false
  }
  return true
}

export function retrieve(key: string): unknown {
  if (!isBrowser) return null

  const result = window.localStorage.getItem(key)
  if (!_.isNil(result)) {
    return JSON.parse(result)
  } else {
    return null
  }
}
