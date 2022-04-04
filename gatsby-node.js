/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const BundleAnalyzer = require("webpack-bundle-analyzer")

const defaultPlugins = []
const developOnlyPlugins = []
const releaseOnlyPlugins = [
  new BundleAnalyzer.BundleAnalyzerPlugin({
    analyzerMode: "disabled",
    generateStatsFile: true,
    statsFilename: "stats.json",
  }),
]

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  actions.setWebpackConfig({
    plugins: [
      ...defaultPlugins,
      ...(stage === "develop" || stage === "develop-html"
        ? developOnlyPlugins
        : releaseOnlyPlugins),
    ],
  })
}
