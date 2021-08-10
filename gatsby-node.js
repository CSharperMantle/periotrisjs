exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        /*
        {
          test: /\.worker\.js$/,
          loader: "worker-loader",
        },
        {
          test: /\.worker\.ts$/,
          loader: "worker-loader",
        },*/
      ],
    },
  })
}
