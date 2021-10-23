/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import PropTypes from "prop-types"
import React from "react"
import { Helmet } from "react-helmet"

import CssBaseline from "@mui/material/CssBaseline"
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles"

import { theme } from "../../src/ThemeOptions"

export default function TopLayout(props) {
  return (
    <>
      <Helmet title="Periotris.js">
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Periotris game built with Gatsby, React and Material UI"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}

TopLayout.propTypes = {
  children: PropTypes.node,
}
