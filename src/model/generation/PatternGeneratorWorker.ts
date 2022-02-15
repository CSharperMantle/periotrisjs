import { Tetrimino } from "../Tetrimino"
import { IGeneratorMessage } from "./IGeneratorMessage"
import { getPlayablePattern, benchmark } from "./internal/PatternGenerator"
import { MessageType } from "./MessageType"

const ctx: Worker = self as never

ctx.onmessage = (eventArgs: MessageEvent<IGeneratorMessage<unknown>>) => {
  const data = eventArgs.data
  switch (data.type) {
    case MessageType.RequestGeneration:
      handleRequestGeneration()
      break
    case MessageType.RequestBenchmark:
      handleRequestBenchmark()
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

function handleRequestBenchmark(): void {
  const result = benchmark()
  const message: IGeneratorMessage<number[]> = {
    type: MessageType.ResponseBenchmark,
    content: result
  }
  ctx.postMessage(message)
}

function handleDefault(data: IGeneratorMessage<unknown>): void {
  console.warn(data.type)
}
