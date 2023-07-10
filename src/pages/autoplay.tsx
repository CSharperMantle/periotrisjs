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

import { PageProps, graphql } from "gatsby"
import React, { useEffect } from "react"

import Box from "@mui/material/Box"

import { PageID } from "../PageID"
import { queryPath } from "../common"
import { BlocksGrid, CommonHead, GameControlBackdrop } from "../components"
import { AutoplayGameViewModel } from "../viewmodel"

const App = ({ data }: PageProps<Queries.GamePageQuery>) => {
  const routes = data.site?.siteMetadata?.navRoutes
  const homePagePath = queryPath(routes, PageID.PAGE_HOME)
  const viewModel = new AutoplayGameViewModel()

  useEffect(() => {
    viewModel.init()
    return () => {
      viewModel.reset(true)
    }
  }, [])

  return (
    <Box
      sx={{
        /* display-related props */
        display: "grid",
        gridTemplateRows: "1fr 90% 1fr",

        /* layouts: width, height, margin, padding, etc.*/
        position: "relative",
        height: "100%",
        minHeight: "0px",
        width: "100%",
        minWidth: "0px",
        boxSizing: "border-box",
        flex: "1 1 auto" /* For common layout */,

        /* element-specific props */
      }}
    >
      <GameControlBackdrop
        homePagePath={homePagePath}
        startGameHandler={viewModel.requestStartGame.bind(viewModel)}
        switchPauseGameHandler={viewModel.switchPauseGame.bind(viewModel)}
      />
      <Box
        sx={{
          gridRow: 2,
          position: "relative",
        }}
      >
        <BlocksGrid />
      </Box>
    </Box>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query GamePage($language: String!) {
    site {
      siteMetadata {
        navRoutes {
          id
          path
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["autoplay"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
