/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const BundleAnalyzer = require("webpack-bundle-analyzer")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new BundleAnalyzer.BundleAnalyzerPlugin({
        analyzerMode: "disabled",
        generateStatsFile: true,
        statsFilename: "stats.json",
      }),
    ],
  })
}
