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

import { Link as GatsbyLink, PageProps, graphql } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next"
import React from "react"

import GitHubIcon from "@mui/icons-material/GitHub"
import HomeIcon from "@mui/icons-material/Home"
import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MuiLink from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"

import { PageID } from "../PageID"
import { queryPath } from "../common"
import { CommonHead } from "../components"

const App = ({ data }: PageProps<Queries.AboutPageQuery>) => {
  const routes = data.site?.siteMetadata?.navRoutes
  const homePagePath = queryPath(routes, PageID.PAGE_HOME)

  const { t } = useI18next()

  return (
    <Container
      maxWidth="md"
      sx={{
        flex: "1 1 auto",
        ml: "auto",
        mr: "auto",
        pt: 4,
        pb: 4,
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tooltip title={t("cap_home")}>
            <IconButton
              size="large"
              aria-label="home"
              component={GatsbyLink}
              to={homePagePath}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h4">{t("typ_h_about")}</Typography>
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
        <Typography variant="body1" paragraph>
          {t("typ_version", { version: data.package?.version })}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_revision", {
            rev: data.gitCommit?.hash?.slice(0, 8),
            branch: data.gitBranch?.name,
          })}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_license", { license: data.package?.license })}
        </Typography>
        <Divider variant="middle" />
        <Typography variant="body1" paragraph>
          {t("typ_p_intro_1")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_intro_2")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_intro_3")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_intro_4_1")}
          <MuiLink href="https://github.com/CSharperMantle">
            CSharperMantle
          </MuiLink>
          {t("typ_p_intro_4_2")}
        </Typography>
        <Divider variant="middle" />
        <Typography variant="h5">{t("typ_h_license")}</Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_license_1")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_license_2")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_license_3")}
        </Typography>
        <Typography variant="body1" paragraph>
          {t("typ_p_license_4_1")}
          <MuiLink href="https://www.gnu.org/licenses/">
            {"https://www.gnu.org/licenses/"}
          </MuiLink>
          {t("typ_p_license_4_2")}
        </Typography>
      </Stack>
    </Container>
  )
}

export default App

export const Head = CommonHead

export const query = graphql`
  query AboutPage($language: String!) {
    site {
      siteMetadata {
        navRoutes {
          id
          path
        }
      }
    }

    gitCommit(latest: { eq: true }) {
      hash
    }

    gitBranch(current: { eq: true }) {
      name
    }

    package {
      version
      license
    }

    locales: allLocale(
      filter: { ns: { in: ["about"] }, language: { eq: $language } }
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
