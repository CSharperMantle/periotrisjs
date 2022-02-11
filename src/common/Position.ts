/**
 * Represents a coordination in the game field.
 *
 * The top-left corner is the O point.
 */
class Position {
  constructor(public x: number, public y: number) {}

  public equals(another: Position): boolean {
    return this.x === another.x && this.y === another.y
  }
}

export { Position }
