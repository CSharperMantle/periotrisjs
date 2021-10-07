import { observer } from "mobx-react"
import React, { useContext } from "react"

import { createStyles, makeStyles, Theme } from "@material-ui/core"

import { PeriotrisViewModelContext } from "../viewmodel"

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    timerDisplayWrapper: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      justifyItems: "center",

      position: "absolute",
      right: "0",
      top: "0",
      width: "10%",
      height: "10%",
      zIndex: theme.zIndex.speedDial,
      margin: "3px",
    },
    timerDisplayTextElapsed: {
      margin: "0 auto",

      textAlign: "center",
      fontSize: "3vh",
      color: "yellow",
    },
    timerDisplayTextFastest: {
      margin: "0 auto",

      textAlign: "center",
      fontSize: "3vh",
      color: "white",
    },
  })
})

const TimerDisplay = observer((): React.ReactElement => {
  const styles = useStyles()
  const viewModel = useContext(PeriotrisViewModelContext)

  const elapsedTime = viewModel.elapsedTime
  const fastestRecord = viewModel.fastestRecord

  return (
    <div className={styles.timerDisplayWrapper}>
      <p className={styles.timerDisplayTextFastest}>
        {fastestRecord.format("mm:ss")}
      </p>
      <p className={styles.timerDisplayTextElapsed}>
        {elapsedTime.format("mm:ss")}
      </p>
    </div>
  )
})

export { TimerDisplay }
