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
      border: "solid 1px #393939",
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

interface IBlockControlText {
  withContent: boolean
  symbolColor: string
  atomicNumber: number
}

const BlockControlText = ({
  withContent,
  symbolColor,
  atomicNumber,
}: IBlockControlText): React.ReactElement => {
  const styles = useStyles()
  if (withContent) {
    // This is a block with textual content.
    return (
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
    )
  } else {
    // This is an empty block with no text.
    return <div />
  }
}

interface IBlockControlProps extends IDisplayBlock {
  key: number
}

const BlockControl = ({
  withContent,
  atomicNumber,
  row,
  column,
  symbolColor,
}: IBlockControlProps): React.ReactElement => {
  const styles = useStyles()

  const backgroundColor = withContent
    ? getBackgroundColorByAtomicNumber(atomicNumber)
    : "black"
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
        backgroundColor: backgroundColor,
      }}
    >
      <BlockControlText
        withContent={withContent}
        symbolColor={symbolColor}
        atomicNumber={atomicNumber}
      />
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
