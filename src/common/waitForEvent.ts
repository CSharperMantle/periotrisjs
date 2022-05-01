import { EventEmitter } from "events"
import _ from "lodash"

/**
 * Asynchronously waits for an event to be emitted.
 *
 * @param target The event target to listen on.
 * @param event The event to wait for and whose firing will resolve the promise.
 * @param errorEvent The event whose firing will reject the promise.
 * @returns A promise that resolves when the event is emitted or rejects when errorEvent is emitted.
 */
export async function waitForEvent<T>(
  target: EventTarget | EventEmitter,
  event: string,
  errorEvent?: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const listenOnce =
      target instanceof EventEmitter
        ? target.once
        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (event: string, func: (...args: any[]) => void) => {
            target.addEventListener(event, func, { once: true })
          }
    listenOnce(event, resolve)
    if (!_.isNil(errorEvent)) {
      listenOnce(errorEvent, reject)
    }
  })
}
