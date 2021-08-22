import _ from "lodash"

import { isBrowserEnv } from "../common/IsBrowserEnv"

function store<T = unknown>(key: string, value: T): boolean {
  if (!isBrowserEnv()) return false

  window.localStorage.setItem(key, JSON.stringify(value))
  return true
}

function retrieve(key: string): unknown {
  if (!isBrowserEnv()) return null

  const result = window.localStorage.getItem(key)
  if (!_.isNil(result)) {
    return JSON.parse(result)
  } else {
    return null
  }
}

export { store, retrieve }
