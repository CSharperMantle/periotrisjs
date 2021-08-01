import { Position } from "../common/Position"
import { TetriminoKind } from "./TetriminoKind"

class Block {
  private _filledBy: TetriminoKind
  public get filledBy(): TetriminoKind {
    return this._filledBy
  }
  public set filledBy(v: TetriminoKind) {
    this._filledBy = v
  }

  private _position: Position
  public get position(): Position {
    return this._position
  }
  public set position(v: Position) {
    this._position = v
  }

  private _atomicNumber: number
  public get atomicNumber(): number {
    return this._atomicNumber
  }
  public set atomicNumber(v: number) {
    this._atomicNumber = v
  }

  private _id: number
  public get id(): number {
    return this._id
  }
  public set id(v: number) {
    this._id = v
  }

  public constructor(
    filledBy: TetriminoKind,
    position: Position,
    atomicNumber: number = 0,
    id: number = 0
  ) {
    this._filledBy = filledBy
    this._position = position
    this._atomicNumber = atomicNumber
    this._id = id
  }
}

export { Block }
