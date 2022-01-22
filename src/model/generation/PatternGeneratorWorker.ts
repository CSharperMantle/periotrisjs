import { Tetrimino } from "../Tetrimino"
import { IGeneratorMessage } from "./IGeneratorMessage"
import { MessageType } from "./MessageType"
import { getPlayablePattern } from "./PatternGenerator"

const ctx: Worker = self as never

ctx.onmessage = (eventArgs: MessageEvent<IGeneratorMessage<unknown>>) => {
  const data = eventArgs.data
  switch (data.type) {
    case MessageType.RequestGeneration:
      handleRequestGeneration()
      break
    default:
      handleDefault(data)
      break
  }
}

function handleRequestGeneration(): void {
  getPlayablePattern().then((tetriminos) => {
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
