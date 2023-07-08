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
import { useI18next } from "gatsby-plugin-react-i18next"
import React from "react"

import FavoriteIcon from "@mui/icons-material/Favorite"
import GitHubIcon from "@mui/icons-material/GitHub"
import InfoIcon from "@mui/icons-material/Info"
import SettingsIcon from "@mui/icons-material/Settings"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { queryPath } from "../common"
import { CommonHead } from "../components"
import { PageID } from "../PageID"

const App = ({ data }: PageProps<Queries.IndexPageQuery>) => {
  const routes = data.site?.siteMetadata?.navRoutes
  const gamePagePath = queryPath(routes, PageID.PAGE_GAME)
  const settingsPagePath = queryPath(routes, PageID.PAGE_SETTINGS)
  const aboutPagePath = queryPath(routes, PageID.PAGE_ABOUT)

  const { t } = useI18next()

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="stretch"
      spacing={3}
      columns={12}
      sx={{
        flex: "1 1 auto",
      }}
      maxWidth="xs"
    >
      <Grid item xs={5}>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          mt={3}
        >
          <Typography variant="h2">Periotris.js</Typography>
          <Typography variant="body1">
            {t("typ_version", { version: data.package?.version })}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Container maxWidth="xs">
          <Stack direction="column" justifyItems="center" spacing={3}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              component={Link}
              to={gamePagePath}
            >
              {t("cap_start")}
            </Button>
          </Stack>
        </Container>
      </Grid>
      <Grid item xs={3}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Tooltip title={t("cap_settings")}>
            <IconButton
              size="large"
              aria-label="settings"
              component={Link}
              to={settingsPagePath}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("cap_about")}>
            <IconButton
              size="large"
              aria-label="about"
              component={Link}
              to={aboutPagePath}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("cap_sponsor")}>
            <IconButton
              size="large"
              aria-label="sponsor"
              href="https://afdian.net/@CSharperMantle"
              target="_blank"
              rel="noopener"
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("cap_github")}>
            <IconButton
              size="large"
              aria-label="github"
              href="https://github.com/CSharperMantle/periotrisjs"
              target="_blank"
              rel="noopener"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query IndexPage($language: String!) {
    site {
      siteMetadata {
        navRoutes {
          id
          path
        }
      }
    }

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
