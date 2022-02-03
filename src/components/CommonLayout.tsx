import "./CommonLayout.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import React from "react"
import { Helmet } from "react-helmet"

import { Box, CssBaseline } from "@mui/material"
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles"

import { theme } from "../../src/ThemeOptions"
import { MainAppBar } from "./MainAppBar"

interface IPageLocationElement {
  name: string
  path: string
}

interface ICommonLayoutProps {
  children: React.ReactNode
}

const CommonLayout = (props: ICommonLayoutProps): React.ReactElement => {
  return (
    <>
      <Helmet title="Periotris.js">
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Get familiar with the Periodic Table of Elements in a fun way, directly in your browsers."
        />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
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
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

export { CommonLayout }

export type { IPageLocationElement, ICommonLayoutProps }
