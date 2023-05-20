/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  plugins: [
    "gatsby-plugin-typescript",
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
  pathPrefix: process.env.BUILD_ADD_PATH_PREFIX ? "/periotrisjs" : undefined,
}

export default config
