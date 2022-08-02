/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { EventEmitter } from "events"
import { isNil } from "./isNil"

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
    if (!isNil(errorEvent)) {
      listenOnce(errorEvent, reject)
    }
  })
}
