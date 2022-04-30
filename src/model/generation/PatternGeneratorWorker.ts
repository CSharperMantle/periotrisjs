import { Tetrimino } from "../Tetrimino"
import { IGeneratorMessage } from "./IGeneratorMessage"
import { getPlayablePattern } from "./internal/PatternGenerator"
import { MessageType } from "./MessageType"

import type { IMap } from "../../customization"

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

async function handleRequestGeneration(map: IMap): Promise<void> {
  const result = await getPlayablePattern(map)
  const message: IGeneratorMessage<Tetrimino[]> = {
    type: MessageType.ResponseSuccess,
    content: result,
  }
  ctx.postMessage(message)
}

async function handleDefault(data: IGeneratorMessage<unknown>): Promise<void> {
  console.warn(data.type)
}
