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

import { PageProps, graphql, navigate } from "gatsby"
import { useI18next } from "gatsby-plugin-react-i18next"
import React from "react"

import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { PageID } from "../PageID"
import { queryPath } from "../common"
import { CommonHead } from "../components"

const ErrorPage = ({ data }: PageProps<Queries.ErrorPageQuery>) => {
  const routes = data.site?.siteMetadata?.navRoutes
  const homePagePath = queryPath(routes, PageID.PAGE_HOME)

  const { t } = useI18next()

  return (
    <Stack
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      sx={{
        flex: "1 1 auto",
      }}
      maxWidth="xs"
    >
      <Typography variant="h3" textAlign="center">
        {t("typ_h_error")}
      </Typography>
      <Typography variant="body1" textAlign="center" paragraph>
        {t("typ_p_error")}
      </Typography>
      <Container maxWidth="xs">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            navigate(homePagePath)
          }}
        >
          {t("cap_home")}
        </Button>
      </Container>
    </Stack>
  )
}

export default ErrorPage

export const Head = CommonHead

export const query = graphql`
  query ErrorPage($language: String!) {
    site {
      siteMetadata {
        navRoutes {
          id
          path
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["404"] }, language: { eq: $language } }
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
