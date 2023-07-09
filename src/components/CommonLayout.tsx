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

import { graphql, useStaticQuery } from "gatsby"
import { SnackbarProvider } from "notistack"
import React from "react"
import { Provider as ReduxProvider } from "react-redux"

import Box from "@mui/material/Box"
import CssBaseline from "@mui/material/CssBaseline"
import { StyledEngineProvider } from "@mui/material/styles"
import ThemeProvider from "@mui/material/styles/ThemeProvider"

import { theme } from "../ThemeOptions"
import { appStore } from "../viewmodel"

export interface ICommonPageLayoutProps {
  readonly children: React.ReactNode
}

export const CommonPageLayout = ({ children }: ICommonPageLayoutProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <>
            <CssBaseline enableColorScheme />
            <Box
              sx={{
                display: "flex",
                flexFlow: "column nowrap",
                minHeight: "100vh",
                maxHeight: "100vh",
              }}
            >
              {children}
            </Box>
          </>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export interface ICommonRootLayoutProps {
  readonly children: React.ReactNode
}

export const CommonRootLayout = ({ children }: ICommonRootLayoutProps) => {
  return <ReduxProvider store={appStore}>{children}</ReduxProvider>
}

export const CommonHead = (): React.ReactElement => {
  const data = useStaticQuery<Queries.CommonHeadQuery>(graphql`
    query CommonHead {
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
      <title>{data.site?.siteMetadata?.title ?? ""}</title>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <meta name="description" content={data.package?.description ?? ""} />
    </>
  )
}
