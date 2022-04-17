function rearrange<T>(array: T[], indices: number[]): T[] {
  const result: T[] = []
  for (let i = 0; i < indices.length; i++) {
    result.push(array[indices[i]])
  }
  return result
}

export { rearrange }
