import dayjs from "dayjs"
import { observer } from "mobx-react"
import React, { useContext } from "react"

import { createStyles, makeStyles } from "@material-ui/core"

import { GameState } from "../model/GameState"
import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const useStyles = makeStyles(() => {
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
    },
    timerDisplayText: {
      margin: "0 auto",

      textAlign: "center",
      fontSize: "3vh",
    },
  })
})

const TimerDisplay = observer((): React.ReactElement => {
  const styles = useStyles()
  const viewModel = useContext(PeriotrisViewModelContext)

  const elapsedMilliseconds = viewModel.elapsedMilliseconds
  const interpretedElapsedMillis = dayjs(elapsedMilliseconds)

  return (
    <div className={styles.timerDisplayWrapper}>
      <p
        className={styles.timerDisplayText}
        style={{
          color:
            viewModel.gameState === GameState.Won && viewModel.isNewRecord
              ? "yellow"
              : "white",
        }}
      >
        {interpretedElapsedMillis.format("mm:ss")}
      </p>
    </div>
  )
})

export { TimerDisplay }
