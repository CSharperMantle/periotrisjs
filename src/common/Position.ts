/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

/**
 * Represents a coordination in the game field.
 *
 * The top-left corner is the O point.
 *
 * This object is immutable.
 */
export class Position {
  constructor(public readonly x: number, public readonly y: number) {}
}

export function positionEquals(p1: Position, p2: Position): boolean {
  return p1.x === p2.x && p1.y === p2.y
}
