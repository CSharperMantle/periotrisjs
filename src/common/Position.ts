/**
 * Represents a coordination in the game field.
 *
 * The top-left corner is the O point.
 */
class Position {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public equals(another: Position): boolean {
    return this.x === another.x && this.y === another.y
  }
}

export { Position }
