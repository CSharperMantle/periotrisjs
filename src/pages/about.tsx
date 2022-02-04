import "@fontsource/fira-code/400.css"

import { graphql, useStaticQuery } from "gatsby"
import React from "react"

import { Container, Divider, Stack, Typography } from "@mui/material"

import { CommonLayout } from "../components"

const App = (): React.ReactElement => {
  const data = useStaticQuery(graphql`
    {
      gitCommit(latest: { eq: true }) {
        hash
      }
      gitBranch(current: { eq: true }) {
        name
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
        <Typography
          variant="h6"
          color={"darkgray"}
          fontFamily={'"Fira Code", Consolas, monospace'}
        >
          Revision {data.gitCommit.hash.slice(0, 8)} @ {data.gitBranch.name}
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
      </Stack>
    </Container>
  )
}

App.Layout = CommonLayout

export default App
