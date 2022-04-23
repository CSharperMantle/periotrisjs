import "./CommonLayout.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import { graphql, useStaticQuery } from "gatsby"
import { SnackbarProvider } from "notistack"
import React from "react"
import Helmet from "react-helmet"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { StyledEngineProvider } from "@mui/material/styles"
import ThemeProvider from "@mui/material/styles/ThemeProvider"

import { theme } from "../../src/ThemeOptions"
import { MainAppBar } from "./MainAppBar"

export interface IPageLocationElement {
  name: string
  path: string
}

export interface ICommonLayoutProps {
  children: React.ReactNode
}

export const CommonLayout = (props: ICommonLayoutProps): React.ReactElement => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      package {
        description
      }
    }
  `)

  return (
    <>
      <Helmet title={`${data.site.siteMetadata.title}`}>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta name="description" content={`${data.package.description}`} />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <CssBaseline enableColorScheme />
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                minHeight: "100vh",
                maxHeight: "100vh",
              }}
            >
              <MainAppBar />
              {/* Now injecting real children. */}
              {props.children}
            </Box>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}
