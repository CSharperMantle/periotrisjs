import "@fontsource/fira-code/400.css"

import { graphql, useStaticQuery } from "gatsby"
import React from "react"

import { Container, Divider, Link, Stack, Typography } from "@mui/material"

import { CommonLayout } from "../components"

const codeStyle = {
  fontFamily: '"Fira Code", Consolas, monospace',
  color: "darkgray",
}

const App = (): React.ReactElement => {
  const data = useStaticQuery(graphql`
    query {
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
    }
  `)

  return (
    <Container
      maxWidth="lg"
      sx={{
        flex: "1 1 auto",
        paddingTop: "3rem",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h2">Periotris.js</Typography>
        <Typography variant="h6" {...codeStyle}>
          Version {data.package.version}
        </Typography>
        <Typography variant="h6" {...codeStyle}>
          Revision {data.gitCommit.hash.slice(0, 8)}@{data.gitBranch.name}
        </Typography>
        <Typography variant="h6" {...codeStyle}>
          License {data.package.license}
        </Typography>
        <Divider variant="middle" />
        <Typography variant="body1" paragraph>
          Some text will eventually fill this place.
        </Typography>
        <Typography variant="body1" paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus
          facilisis velit, sit amet maximus lacus commodo ac. Aenean lacus ante,
          tincidunt sed molestie a, interdum sit amet quam. Sed dictum mauris
          hendrerit tristique blandit. In eu quam id massa hendrerit sagittis et
          nec massa. Phasellus a dui pretium, mollis nulla quis, faucibus justo.
          Vivamus aliquam urna eget placerat imperdiet.
        </Typography>
        <Typography variant="body1" paragraph>
          Nullam non nisl eu arcu laoreet commodo ac vitae tellus. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos. Donec in libero rutrum, porttitor nisl vitae, pulvinar
          nulla. Sed augue turpis, laoreet a maximus quis, tempor et nulla. Sed
          in facilisis diam. Nulla facilisi. Nullam a mauris sed diam venenatis
          faucibus. Donec nec interdum nisi. Ut vitae tellus massa.{" "}
        </Typography>
        <Divider variant="middle" />
        <Typography variant="body1" paragraph>
          Copyright (C) 2021 Rong &quot;Mantle&quot; Bao
        </Typography>
        <Typography variant="body1" paragraph>
          This program is free software: you can redistribute it and/or modify
          it under the terms of the GNU General Public License as published by
          the Free Software Foundation, either version 3 of the License, or (at
          your option) any later version.
        </Typography>
        <Typography variant="body1" paragraph>
          This program is distributed in the hope that it will be useful, but
          WITHOUT ANY WARRANTY; without even the implied warranty of
          MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
          General Public License for more details.
        </Typography>
        <Typography variant="body1" paragraph>
          You should have received a copy of the GNU General Public License
          along with this program. If not, see{" "}
          <Link href="https://github.com/CSharperMantle/periotrisjs/blob/main/LICENSE">
            LICENSE
          </Link>
          .
        </Typography>
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
