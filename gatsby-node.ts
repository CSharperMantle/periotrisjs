import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

import type { GatsbyNode } from "gatsby"

const commonPlugins: unknown[] = []
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
  })
}
