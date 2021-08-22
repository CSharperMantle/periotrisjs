import { observer } from "mobx-react"
import React, { useContext } from "react"

import { createStyles, makeStyles } from "@material-ui/core"

import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"
import { BlockControl } from "./BlockControl"
import { TimerDisplay } from "./TimerDisplay"

const useStyles = makeStyles(() => {
  return createStyles({
    playArea: {
      margin: "0 auto",

      position: "relative",
      height: "100%",
      aspectRatio: "auto 18 / 11",

      backgroundColor: "black",
    },

    canvasGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(18, 1fr)",
      gridTemplateRows: "repeat(11, 1fr)",

      position: "relative",
      width: "100%",
      height: "100%",
    },
  })
})

const BlocksGrid = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)
  const styles = useStyles()

  const blocks = viewModel.sprites.map(
    (block: IDisplayBlock, index: number) => {
      return (
        <BlockControl
          key={index}
          atomicNumber={block.atomicNumber}
          row={block.row}
          column={block.column}
          symbolColor={block.symbolColor}
        />
      )
    }
  )
  return (
    <div className={styles.playArea}>
      <TimerDisplay />
      <div className={styles.canvasGrid}>{blocks}</div>
    </div>
  )
})

export { BlocksGrid }
