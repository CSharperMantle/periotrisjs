/**
 * Represents a coordination in the game field.
 *
 * The top-left corner is the O point.
 *
 * This object is immutable.
 */
class Position {
  constructor(public readonly x: number, public readonly y: number) {}

  public equals(another: Position): boolean {
    return this.x === another.x && this.y === another.y
  }
}

export { Position }
