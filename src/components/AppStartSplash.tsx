import { observer } from "mobx-react"
import React from "react"

import {
  Container,
  createStyles,
  Grid,
  Grow,
  Link,
  Paper,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core"

import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const styles = (theme: Theme) => {
  return createStyles({
    paper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
    },
  })
}

interface IAppStartSplashProps extends WithStyles<typeof styles> {
  goOutTimeout: number
}

interface IAppStartSplashState {
  visible: boolean
}

const AppStartSplash = withStyles(styles)(
  observer(
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
            <Paper className={this.props.classes.paper} elevation={3}>
              <Container className={this.props.classes.container}>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  spacing={3}
                >
                  <Grid item xs={6}>
                    <Typography variant="h1" style={{ textAlign: "center" }}>
                      Periotris.js
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      Periotris.js is a TypeScript porting of CSharperMantle's
                      Periotris game.
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Link
                      href="https://github.com/CSharperMantle/periotrisjs/"
                      variant="body1"
                    >
                      Repository
                    </Link>
                  </Grid>
                </Grid>
              </Container>
            </Paper>
          </Grow>
        )
      }
    }
  )
)

export { AppStartSplash }
