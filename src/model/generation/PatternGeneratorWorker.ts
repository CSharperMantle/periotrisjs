import { Tetrimino } from "../Tetrimino"
import { IGeneratorMessage } from "./IGeneratorMessage"
import { MessageType } from "./MessageType"
import { getPlayablePattern } from "./PatternGenerator"

const ctx: Worker = self as any

ctx.onmessage = (eventArgs) => {
  const data = eventArgs.data as IGeneratorMessage
  switch (data.type) {
    case MessageType.RequestGeneration:
      const tetriminos: Tetrimino[] = getPlayablePattern()
      const message: IGeneratorMessage = {
        type: MessageType.ResponseSuccess,
        content: tetriminos,
      }
      ctx.postMessage(message)
      break
    default:
      console.warn(data.type)
      break
  }
}
