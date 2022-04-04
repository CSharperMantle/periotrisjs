import _ from "lodash"
import React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { customizationFacade } from "../customization"
import defaultPeriodicTable from "../json/DefaultPeriodicTable.json"

import type { IBlockDisplay } from "./IBlockDisplay"

interface IBlockControlText {
  hasContent: boolean
  atomicNumber: number
}

const BlockControlText = ({
  hasContent,
  atomicNumber,
}: IBlockControlText): React.ReactElement => {
  if (hasContent) {
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

interface IBlockControlProps {
  block: IBlockDisplay
}

const BlockControl = ({ block }: IBlockControlProps): React.ReactElement => {
  const backgroundColor = block.hasContent
    ? getBackgroundColorByAtomicNumber(block.atomicNumber)
    : "black"
  const border = block.hasBorder ? "1px solid #393939" : "none"
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

        gridRow: block.row + 1,
        gridColumn: block.column + 1,
        backgroundColor: backgroundColor,
      }}
    >
      <BlockControlText
        hasContent={block.hasContent}
        atomicNumber={block.atomicNumber}
      />
    </Box>
  )
}

function getBackgroundColorByAtomicNumber(atomicNumber: number): string {
  const colorScheme = customizationFacade.settings.colorScheme

  for (let i = 0; i < colorScheme.rules.length; i++) {
    const rule = colorScheme.rules[i]
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
