module.exports = {
  plugins: [
    "gatsby-plugin-typescript",
    "gatsby-plugin-top-layout",
    {
      resolve: "gatsby-plugin-material-ui",
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    "gatsby-plugin-react-helmet",
  ],
  siteMetadata: {
    title: "PeriotrisJS",
  },
  pathPrefix: "/periotrisjs",
}
