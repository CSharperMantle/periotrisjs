import { flushSync } from "react-dom"

/**
 * Create a function that triggers a flush of the DOM after it is called.
 *
 * @param fn The function to wrap.
 * @returns The wrapped function.
 */
export function flushed<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
  return (...args: TArgs) => flushSync(() => fn(...args))
}
