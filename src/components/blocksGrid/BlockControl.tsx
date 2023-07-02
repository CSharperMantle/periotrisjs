/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import React from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { customizationFacade } from "../../customization"
import defaultPeriodicTable from "../../json/DefaultPeriodicTable.json"

import type { IBlockDisplay } from "./IBlockDisplay"

interface IBlockControlText {
  readonly hasContent: boolean
  readonly atomicNumber: number
}

const BlockControlText = ({ hasContent, atomicNumber }: IBlockControlText) => {
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
  readonly block: IBlockDisplay
}

export const BlockControl = ({ block }: IBlockControlProps) => {
  const backgroundColor = block.hasContent
    ? getBackgroundColorByAtomicNumber(block.atomicNumber)
    : "black"
  const borderThickness = customizationFacade.settings.borderThickness
  const border = block.hasBorder ? `${borderThickness}px solid #393939` : "none"
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

export function getBackgroundColorByAtomicNumber(atomicNumber: number): string {
  const colorScheme = customizationFacade.settings.colorScheme

  for (let i = 0; i < colorScheme.rules.length; i++) {
    const rule = colorScheme.rules[i]
    if (rule.range.from <= atomicNumber && atomicNumber <= rule.range.to) {
      return rule.color
    }
  }
  throw new RangeError("atomicNumber")
}
