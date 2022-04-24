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
      "The length of the array and the length of the indices must be equal."
    )
  }

  const result: T[] = []
  for (let i = 0; i < indices.length; i++) {
    result.push(array[indices[i]])
  }
  return result
}
