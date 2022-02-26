import { Tetrimino } from "../Tetrimino"
import { IGeneratorMessage } from "./IGeneratorMessage"
import { getPlayablePattern } from "./internal/PatternGenerator"
import { MessageType } from "./MessageType"

import type { IMap } from "../../customization"

const ctx: Worker = self as never

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
  getPlayablePattern(map).then((tetriminos) => {
    const message: IGeneratorMessage<Tetrimino[]> = {
      type: MessageType.ResponseSuccess,
      content: tetriminos,
    }
    ctx.postMessage(message)
  })
}

function handleDefault(data: IGeneratorMessage<unknown>): void {
  console.warn(data.type)
}
