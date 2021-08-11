import "./SuccessBanner.css"

import { observer } from "mobx-react"
import React from "react"

import { Container, Fade, Grid, Typography } from "@material-ui/core"

import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

const SuccessBanner = observer(
  class SuccessBanner extends React.Component {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      return (
        <Fade in={viewModel.gameWon}>
          <Grid
            container
            className="success-banner__grid"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Container maxWidth="lg">
                <Typography variant="h2" style={{ textAlign: "center" }}>
                  The Periodic Table of Elements
                </Typography>
              </Container>
            </Grid>
          </Grid>
        </Fade>
      )
    }
  }
)

export { SuccessBanner }
