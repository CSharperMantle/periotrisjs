import { graphql, Link, useStaticQuery } from "gatsby"
import _ from "lodash"
import React from "react"

import { Button, Container, Stack, Typography } from "@mui/material"

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

  const gamePage = _.filter(PageLocation, (page) => page.name === "Game")[0]

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
