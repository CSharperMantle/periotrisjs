/**
 * Represents a coordination in the game field.
 *
 * The top-left corner is the O point.
 *
 * This object is immutable.
 */
class Position {
  constructor(public readonly x: number, public readonly y: number) {}
}

function positionEquals(p1: Position, p2: Position): boolean {
  return p1.x === p2.x && p1.y === p2.y
}

export { Position, positionEquals }
