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

import { MessageType } from "./IGeneratorMessage"
import {
  NoSolutionError,
  getPlayablePattern,
} from "./internal/PatternGenerator"

import type { IMap } from "../../customization"
import type { IGeneratorMessage } from "./IGeneratorMessage"

const ctx = self as unknown as Worker

ctx.onmessage = (eventArgs: MessageEvent<IGeneratorMessage<unknown>>) => {
  const data = eventArgs.data
  switch (data.type) {
    case MessageType.RequestGeneration:
      handleRequestGeneration(data.content as IMap)
      break
    default:
      handleDefault(data)
      break
  }
}

function handleRequestGeneration(map: IMap): void {
  getPlayablePattern(map).then(
    (result) => {
      ctx.postMessage({
        type: MessageType.ResponseSuccess,
        content: result,
      })
    },
    (err) => {
      ctx.postMessage({
        type: MessageType.ResponseFailed,
        content: err as NoSolutionError,
      })
    }
  )
}

function handleDefault(data: IGeneratorMessage<unknown>): void {
  console.warn(data.type)
}
