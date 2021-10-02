/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path")
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    plugins: [
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "."),
      }),
    ],
    experiments: {
      asyncWebAssembly: true,
    },
  })
}
