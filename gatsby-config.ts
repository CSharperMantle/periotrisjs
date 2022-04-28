import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  plugins: [
    "gatsby-plugin-typescript",
    {
      resolve: "gatsby-plugin-material-ui",
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Periotris.js",
        short_name: "Periotris.js",
        start_url: "./",
        display: "fullscreen",
        icon: "static/Icon.png",
        background_color: "#303030",
        theme_color: "#7a84e8",
        orientation: "landscape",
      },
    },
    {
      resolve: "gatsby-plugin-offline",
      options: {
        precachePages: ["/", "/404", "/about", "/game", "/settings"],
      },
    },
    "gatsby-source-local-git",
    "gatsby-source-package",
  ],
  siteMetadata: {
    title: "Periotris.js",
    description:
      "Learn the Periodic Table of Elements in a fun way, directly in your browsers.",
    url: "https://csharpermantle.github.io/periotrisjs/",
  },
  pathPrefix: "/periotrisjs",
}

export default config
