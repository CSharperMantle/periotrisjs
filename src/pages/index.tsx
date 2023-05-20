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

import { graphql, Link, PageProps } from "gatsby"
import { useTranslation } from "gatsby-plugin-react-i18next"
import React from "react"

import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { CommonHead } from "../components"
import PageLocation from "../json/PageLocation.json"

const codeStyle = {
  fontFamily: '"Fira Code", Consolas, monospace',
}

const App = ({
  data,
}: PageProps<Queries.IndexPageQuery>): React.ReactElement => {
  const gamePage = PageLocation.filter((page) => page.name === "Game")[0]

  const { t } = useTranslation()

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={8}
      sx={{
        flex: "1 1 auto",
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Typography variant="h2">Periotris.js</Typography>
        <Typography variant="body1" {...codeStyle}>
          {t("indexVersion", { version: data.package?.version })}
        </Typography>
      </Stack>
      <Container
        maxWidth="sm"
        sx={{
          margin: "0 auto",
        }}
      >
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderColor: "white",
            color: "white",
            alignSelf: "stretch",
            width: "100%",
          }}
          component={Link}
          to={gamePage.path}
        >
          {t("indexStart")}
        </Button>
      </Container>
    </Stack>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query IndexPage($language: String!) {
    package {
      version
    }
    locales: allLocale(
      filter: { ns: { in: ["index"] }, language: { eq: $language } }
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
