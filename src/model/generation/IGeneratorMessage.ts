import { MessageType } from "./MessageType"

interface IGeneratorMessage<T = unknown> {
  type: MessageType
  content: T
}

export { IGeneratorMessage }
