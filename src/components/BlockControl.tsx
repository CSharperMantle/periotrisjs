import _ from "lodash"
import React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import defaultColorScheme from "../json/DefaultColorScheme.json"
import defaultPeriodicTable from "../json/DefaultPeriodicTable.json"

import type { IDisplayBlock } from "../viewmodel"

interface IBlockControlText {
  withContent: boolean
  atomicNumber: number
}

const BlockControlText = ({
  withContent,
  atomicNumber,
}: IBlockControlText): React.ReactElement => {
  if (withContent) {
    // This is a block with textual content.
    return (
      <Typography
        sx={{
          display: "block",

          position: "relative",
          margin: "0 auto",

          userSelect: "none",
          textAlign: "center",
          fontSize: "3vh",
        }}
        color={"black"}
      >
        {atomicNumber > 0
          ? defaultPeriodicTable.elements[atomicNumber - 1].symbol
          : -atomicNumber}
      </Typography>
    )
  } else {
    // This is an empty block with no text.
    return <Box />
  }
}

interface IBlockControlProps extends IDisplayBlock {
  key: number
}

const BlockControl = ({
  withContent,
  withBorder,
  atomicNumber,
  row,
  column,
}: IBlockControlProps): React.ReactElement => {
  const backgroundColor = withContent
    ? getBackgroundColorByAtomicNumber(atomicNumber)
    : "black"
  const border = withBorder ? "1px solid #393939" : "none"
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        position: "relative",
        height: "100%",
        width: "100%",
        padding: "5% 5% 5% 5%",
        boxSizing: "border-box",

        border: { border },

        gridRow: row + 1,
        gridColumn: column + 1,
        backgroundColor: backgroundColor,
      }}
    >
      <BlockControlText withContent={withContent} atomicNumber={atomicNumber} />
    </Box>
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
  throw new RangeError("atomicNumber")
}

export { BlockControl, getBackgroundColorByAtomicNumber }
