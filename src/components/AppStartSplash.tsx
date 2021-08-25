import { observer } from "mobx-react"
import React, { useState } from "react"

import {
  Container,
  createStyles,
  Grid,
  Grow,
  Link,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    paper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: theme.zIndex.drawer,
    },
    container: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      height: "100%",
    },
  })
})

interface IAppStartSplashProps {
  goOutTimeout: number
}

const AppStartSplash = observer(({ goOutTimeout }: IAppStartSplashProps) => {
  const styles = useStyles()
  const [visibleState, setVisibleState] = useState(true)

  setTimeout(() => {
    setVisibleState(false)
  }, goOutTimeout)

  return (
    <Grow in={visibleState}>
      <Paper className={styles.paper} elevation={3}>
        <Container className={styles.container}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={3}
          >
            <Grid item xs={12}>
              <Typography variant="h1" style={{ textAlign: "center" }}>
                Periotris.js
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                Periotris.js is a TypeScript porting of CSharperMantle&apos;s
                Periotris game.
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
})

export { AppStartSplash }
