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

import { defaultLang, langs } from "./src/i18n"
import { PageID } from "./src/PageID"

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
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/i18n/locales`,
        name: "locale",
      },
    },
    {
      resolve: "gatsby-plugin-react-i18next",
      options: {
        languages: langs,
        defaultLanguage: defaultLang,
        i18nextOptions: {
          fallbackLng: defaultLang,
          supportedLngs: langs,
          defaultNS: "common",
          interpolation: {
            escapeValue: false,
          },
        },
      },
    },
  ],
  siteMetadata: {
    title: "Periotris.js",
    description:
      "Learn the Periodic Table of Elements in a fun way, directly in your browsers.",
    url: "https://csmantle.top/periotrisjs/",
    navRoutes: [
      {
        id: PageID.PAGE_HOME,
        path: "/",
      },
      {
        id: PageID.PAGE_GAME,
        path: "/game",
      },
      {
        id: PageID.PAGE_AUTOPLAY,
        path: "/autoplay",
      },
      {
        id: PageID.PAGE_SETTINGS,
        path: "/settings",
      },
      {
        id: PageID.PAGE_ABOUT,
        path: "/about",
      },
    ],
  },
  pathPrefix: process.env.BUILD_ADD_PATH_PREFIX ? "/periotrisjs" : undefined,
  graphqlTypegen: {
    generateOnBuild: true,
  },
}

export default config
