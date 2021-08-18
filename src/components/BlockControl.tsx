import _ from "lodash"
import React from "react"

import { createStyles, makeStyles } from "@material-ui/core"

import defaultColorScheme from "../json/DefaultColorScheme.json"
import defaultPeriodicTable from "../json/DefaultPeriodicTable.json"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"

const useStyles = makeStyles(() => {
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
})

interface IBlockControlProps extends IDisplayBlock {
  key: number
}

const BlockControl = ({
  atomicNumber,
  row,
  column,
  symbolColor,
}: IBlockControlProps): React.ReactElement => {
  const styles = useStyles()

  return (
    <div
      className={styles.blockControl}
      style={{
        /*
         * Add one to grid-row and grid-column because CSS
         * properties of grid start from 1.
         */
        gridRow: row + 1,
        gridColumn: column + 1,
        backgroundColor: getBackgroundColorByAtomicNumber(atomicNumber),
      }}
    >
      <div
        className={styles.symbol}
        style={{
          color: symbolColor,
        }}
      >
        {atomicNumber > 0
          ? defaultPeriodicTable.elements[atomicNumber - 1].symbol
          : -atomicNumber}
      </div>
    </div>
  )
}

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
