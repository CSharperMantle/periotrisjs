function isBrowserEnv(): boolean {
  return [typeof window, typeof document].includes("undefined") === false
}

export { isBrowserEnv }
