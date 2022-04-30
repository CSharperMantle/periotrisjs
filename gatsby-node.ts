import path from "path"

import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin"

import type { GatsbyNode } from "gatsby"

const commonPlugins: unknown[] = [
  new WasmPackPlugin({
    crateDirectory: path.resolve(__dirname, "."),
  }),
]
const developOnlyPlugins: unknown[] = []
const releaseOnlyPlugins: unknown[] = [
  new BundleAnalyzerPlugin({
    analyzerMode: "disabled",
    generateStatsFile: true,
    statsFilename: "stats.json",
  }),
]

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  stage,
  actions,
}) => {
  actions.setWebpackConfig({
    plugins: [
      ...commonPlugins,
      ...(stage === "develop" || stage === "develop-html"
        ? developOnlyPlugins
        : releaseOnlyPlugins),
    ],
    experiments: {
      asyncWebAssembly: true,
    },
  })
}
