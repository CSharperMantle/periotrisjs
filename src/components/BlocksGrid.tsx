import { observer } from "mobx-react"
import React from "react"

import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core"

import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"
import { BlockControl } from "./BlockControl"

const styles = (theme: Theme) => {
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
}

interface IBlocksGridProps extends WithStyles<typeof styles> {}

const BlocksGrid = withStyles(styles)(
  observer(
    class BlocksGrid extends React.Component<IBlocksGridProps> {
      static contextType = PeriotrisViewModelContext
      declare context: React.ContextType<typeof PeriotrisViewModelContext>

      public render() {
        const viewModel: PeriotrisViewModel = this.context

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
          <div className={this.props.classes.playArea}>
            <div className={this.props.classes.canvasGrid}>{blocks}</div>
          </div>
        )
      }
    }
  )
)

export { BlocksGrid }
