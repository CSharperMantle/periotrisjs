import React from "react"

import {
  Backdrop,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    modalBackdrop: {
      zIndex: theme.zIndex.modal,
    },
    grid: {
      height: "100%",
    },
    text: {
      textAlign: "center",
    },
  })
})

const PortraitWarningBanner = (props: {}) => {
  const styles = useStyles()
  const isPortrait = useMediaQuery("(orientation: portrait)")

  return (
    <Backdrop className={styles.modalBackdrop} open={isPortrait}>
      <Grid
        container
        className={styles.grid}
        direction="column"
        alignItems="center"
        justifyContent="space-evenly"
        spacing={1}
      >
        <Typography className={styles.text} variant="h2">
          Landscape.
        </Typography>
        <Typography className={styles.text} variant="body1">
          You are now in portrait mode.
          <br />
          Please switch to landscape mode.
        </Typography>
      </Grid>
    </Backdrop>
  )
}

export { PortraitWarningBanner }
