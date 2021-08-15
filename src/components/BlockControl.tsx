import _ from "lodash"
import React from "react"

import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core"

import defaultColorScheme from "../json/DefaultColorScheme.json"
import defaultPeriodicTable from "../json/DefaultPeriodicTable.json"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"

const styles = (theme: Theme) => {
  return createStyles({
    blockControl: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      position: "relative",
      height: "100%",
      width: "100%",
      padding: "5% 5% 5% 5%",
      boxSizing: "border-box",

      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      border: "solid 1px black",
    },
    symbol: {
      display: "block",

      position: "relative",
      margin: "0 auto",

      userSelect: "none",
      textAlign: "center",
      fontSize: "3vh",
    },
  })
}

interface IBlockControlProps extends IDisplayBlock, WithStyles<typeof styles> {
  key: number
}

const BlockControl = withStyles(styles)(
  class BlockControl extends React.Component<IBlockControlProps> {
    public constructor(props: IBlockControlProps) {
      super(props)
    }

    public render() {
      return (
        <div
          className={this.props.classes.blockControl}
          style={{
            /*
             * Add one to grid-row and grid-column because CSS
             * properties of grid start from 1.
             */
            gridRow: this.props.row + 1,
            gridColumn: this.props.column + 1,
            backgroundColor: getBackgroundColorByAtomicNumber(
              this.props.atomicNumber
            ),
          }}
        >
          <div
            className={this.props.classes.symbol}
            style={{
              color: this.props.symbolColor,
            }}
          >
            {this.props.atomicNumber > 0
              ? defaultPeriodicTable.elements[this.props.atomicNumber - 1]
                  .symbol
              : -this.props.atomicNumber}
          </div>
        </div>
      )
    }
  }
)

function getBackgroundColorByAtomicNumber(atomicNumber: number): string {
  for (let i = 0; i < defaultColorScheme.rules.length; i++) {
    const rule = defaultColorScheme.rules[i]
    if (
      _.inRange(
        atomicNumber,
        rule.atomicNumberRange.from,
        rule.atomicNumberRange.to + 1
      )
    ) {
      return rule.color
    }
  }
  throw new Error("atomicNumber")
}

export { BlockControl, getBackgroundColorByAtomicNumber }
