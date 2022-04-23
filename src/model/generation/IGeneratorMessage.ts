import { MessageType } from "./MessageType"

export interface IGeneratorMessage<T> {
  type: MessageType
  content: T
}
