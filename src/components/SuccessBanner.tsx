import { observer } from "mobx-react"
import React from "react"

import {
  Container,
  createStyles,
  Fade,
  Grid,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core"

import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

const styles = () => {
  return createStyles({
    successBannerGrid: {
      width: "100%",
      height: "100%",
    },
  })
}

interface ISuccessBannerProps extends WithStyles<typeof styles> {}

const SuccessBanner = withStyles(styles)(
  observer(
    class SuccessBanner extends React.Component<ISuccessBannerProps> {
      static contextType = PeriotrisViewModelContext
      declare context: React.ContextType<typeof PeriotrisViewModelContext>

      public render() {
        const viewModel: PeriotrisViewModel = this.context

        return (
          <Fade in={viewModel.gameWon}>
            <Grid
              container
              className={this.props.classes.successBannerGrid}
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
)

export { SuccessBanner }
