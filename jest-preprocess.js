/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const babelOptions = {
  presets: ["@babel/preset-react"],
}

module.exports = require("babel-jest").default.createTransformer(babelOptions)
