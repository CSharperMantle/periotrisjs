interface IColorSchemeRule {
  atomicNumberRange: { from: number; to: number }
  color: string
}

interface IColorScheme {
  rules: IColorSchemeRule[]
}

export type { IColorScheme, IColorSchemeRule }
