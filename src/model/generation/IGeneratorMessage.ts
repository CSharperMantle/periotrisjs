import { MessageType } from "./MessageType"

interface IGeneratorMessage<T> {
  type: MessageType
  content: T
}

export type { IGeneratorMessage }
