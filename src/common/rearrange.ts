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
 * Rearrange the given array of objects by the given key.
 *
 * @param array The array to rearrange.
 * @param indices The desired indices of elements.
 * @returns A new array with rearranged elements.
 *
 * @throws {Error} If the length of the given array and indices are not equal.
 */
export function rearrange<T>(array: T[], indices: number[]): T[] {
  if (array.length !== indices.length) {
    throw new Error(
      `rearrange: array length ${array.length} !== indices length ${indices.length}`
    )
  }

  const result: T[] = []
  for (let i = 0; i < indices.length; i++) {
    result.push(array[indices[i]])
  }
  return result
}
