import { graphql, Link, useStaticQuery } from "gatsby"
import _ from "lodash"
import React from "react"

import { Settings as SettingsIcon } from "@mui/icons-material"
import { Button, Container, IconButton, Stack, Typography } from "@mui/material"

import { CommonLayout } from "../components"
import PageLocation from "../json/PageLocation.json"

const codeStyle = {
  fontFamily: '"Fira Code", Consolas, monospace',
}

// TODO: Finish this!
const App = (): React.ReactElement => {
  const data = useStaticQuery(graphql`
    query {
      package {
        version
      }
    }
  `)

  const gamePage = _.filter(PageLocation, (page) => page.name === "Game")[0]
  const settingsPage = _.filter(
    PageLocation,
    (page) => page.name === "Settings"
  )[0]

  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={16}
      sx={{
        flex: "1 1 auto",
        padding: "16px",
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
      <Container maxWidth="sm">
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "white",
              color: "white",
              alignSelf: "stretch",
            }}
            component={Link}
            to={gamePage.path}
          >
            Start
          </Button>
        </Stack>
      </Container>
      <IconButton
        aria-label="open settings"
        component={Link}
        to={settingsPage.path}
      >
        <SettingsIcon />
      </IconButton>
    </Stack>
  )
}

App.Layout = CommonLayout

export default App
