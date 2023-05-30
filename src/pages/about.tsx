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

import { graphql, PageProps } from "gatsby"
import React from "react"

import Container from "@mui/material/Container"
import Divider from "@mui/material/Divider"
import Link from "@mui/material/Link"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"

import { CommonHead } from "../components"

const App = ({
  data,
}: PageProps<Queries.AboutPageQuery>): React.ReactElement => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        flex: "1 1 auto",
        paddingTop: 2,
        paddingBottom: 2,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h2">About Periotris.js</Typography>
        <Typography variant="body1" paragraph>
          Version: {data.package?.version}
        </Typography>
        <Typography variant="body1" paragraph>
          Revision: {data.gitCommit?.hash?.slice(0, 8)}@{data.gitBranch?.name}
        </Typography>
        <Typography variant="body1" paragraph>
          License: {data.package?.license}
        </Typography>
        <Divider variant="middle" />
        <Typography variant="body1" paragraph>
          Periotris.js is your best companion for learning and memorizing the
          Periodic Table of Elements.
        </Typography>
        <Typography variant="body1" paragraph>
          Combining the classic game experience of Tetris with the periodic
          table, Periotris.js is a successful attempt of breathing vitality into
          the boredom of chemistry learning.
        </Typography>
        <Typography variant="body1" paragraph>
          The rumor that periodic table is constructed out of a game of Tetris
          has been brought to reality. By playing Periotris.js you can
          experience the thrill of fitting elements into right slots like a real
          chemist. Despite its simplicity, Periotris.js is a challenging game
          that puts the player&apos;s knowledge of descriptive chemistry to the
          test. Try finish the game in the shortest time possible and experience
          the excitement of completing another brick in the wall of chemistry.
        </Typography>
        <Typography variant="body1" paragraph>
          Built with ❤ by{" "}
          <Link href="https://github.com/CSharperMantle">CSharperMantle</Link>.
          Special thanks to Mr. Longdi Xu, my high school chemistry teacher, for
          sparking the idea that finally went so far as this.
        </Typography>
        <Divider variant="middle" />
        <Typography variant="h4">License</Typography>
        <Typography variant="body1" paragraph>
          Copyright (C) 2021-present Rong &quot;Mantle&quot; Bao
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

export default App

export const Head = CommonHead

export const query = graphql`
  query AboutPage {
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
`
