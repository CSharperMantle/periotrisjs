export interface IColorSchemeRule {
  atomicNumberRange: { from: number; to: number }
  color: string
}

export interface IColorScheme {
  rules: IColorSchemeRule[]
}
