import "./AppStartSplash.css"

import { observer } from "mobx-react"
import React from "react"

import { Grid, Grow, Paper, Typography } from "@material-ui/core"

import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

interface IAppStartSplashProps {
  goOutTimeout: number
}

interface IAppStartSplashState {
  visible: boolean
}

const AppStartSplash = observer(
  class AppStartSplash extends React.Component<
    IAppStartSplashProps,
    IAppStartSplashState
  > {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public constructor(props: IAppStartSplashProps) {
      super(props)

      this.state = {
        visible: true,
      }
    }

    public render() {
      setTimeout(() => {
        this.setState({ visible: false })
      }, this.props.goOutTimeout)

      return (
        <Grow in={this.state.visible}>
          <Paper className="app-start-splash" elevation={3}>
            <Grid
              container
              className="app-start-splash__grid"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Typography variant="h1" style={{ textAlign: "center" }}>
                  Periotris.js
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grow>
      )
    }
  }
)

export { AppStartSplash }
