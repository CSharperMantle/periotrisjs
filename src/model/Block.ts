import { Position } from "../common/Position"
import { TetriminoKind } from "./TetriminoKind"

class Block {
  private _filledBy: TetriminoKind = null
  public get filledBy(): TetriminoKind {
    return this._filledBy
  }
  public set filledBy(v: TetriminoKind) {
    this._filledBy = v
  }

  private _position: Position = null
  public get position(): Position {
    return this._position
  }
  public set position(v: Position) {
    this._position = v
  }

  private _atomicNumber: number = null
  public get atomicNumber(): number {
    return this._atomicNumber
  }
  public set atomicNumber(v: number) {
    this._atomicNumber = v
  }

  private _id: number = null
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
    this.filledBy = filledBy
    this.position = position
    this.atomicNumber = atomicNumber
    this.id = id
  }
}

export { Block }
