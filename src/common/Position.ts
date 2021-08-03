class Position {
  public X: number
  public Y: number

  constructor(x: number, y: number) {
    this.X = x
    this.Y = y
  }

  public equals(another: Position): boolean {
    return this.X === another.X && this.Y === another.Y
  }
}

export { Position }
