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

import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"

import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { CommonLayout } from "../components"
import PageLocation from "../json/PageLocation.json"

const codeStyle = {
  fontFamily: '"Fira Code", Consolas, monospace',
}

const App = (): React.ReactElement => {
  const data = useStaticQuery(graphql`
    query {
      package {
        version
      }
    }
  `)

  const gamePage = PageLocation.filter((page) => page.name === "Game")[0]

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
          v{data.package.version}
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
          Start
        </Button>
      </Container>
    </Stack>
  )
}

App.Layout = CommonLayout

export default App
