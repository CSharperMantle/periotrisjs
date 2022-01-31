import { isBrowser } from "is-in-browser"
import _ from "lodash"

function store<T = unknown>(key: string, value: T): boolean {
  if (!isBrowser) return false

  window.localStorage.setItem(key, JSON.stringify(value))
  return true
}

function retrieve(key: string): unknown {
  if (!isBrowser) return null

  const result = window.localStorage.getItem(key)
  if (!_.isNil(result)) {
    return JSON.parse(result)
  } else {
    return null
  }
}

export { store, retrieve }
