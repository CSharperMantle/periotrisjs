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

import TextField from "@mui/material/TextField"

import { isNil } from "../common"

import type { TResult } from "../common"

interface INumberFormControlProps {
  readonly id: string
  readonly initialContent: string
  readonly label: string
  readonly helperText: string
  readonly adornments?: {
    readonly startAdornment?: React.ReactElement
    readonly endAdornment?: React.ReactElement
  }
  readonly step?: number
  readonly min?: number
  readonly max?: number
  readonly disabled?: boolean
  readonly onChange: (newContent: string) => TResult<never, string>
  readonly contentPreprocessor?: (content: string) => string
}

export const NumberFormControl = (props: INumberFormControlProps) => {
  const [content, setContent] = React.useState(props.initialContent)
  const [error, setError] = React.useState(false)
  const [helperText, setHelperText] = React.useState(props.helperText)

  return (
    <TextField
      id={props.id}
      value={content}
      label={props.label}
      type="number"
      helperText={helperText}
      InputProps={{ ...props.adornments }}
      inputProps={{
        inputMode: "numeric",
        step: props.step,
        min: props.min,
        max: props.max,
      }}
      disabled={props.disabled ?? false}
      error={error}
      onChange={(event) => {
        const content = isNil(props.contentPreprocessor)
          ? event.target.value
          : props.contentPreprocessor(event.target.value)
        const result = props.onChange(content)
        setContent(content)
        setError(!result.ok)
        setHelperText(
          result.ok ? props.helperText : result.err ?? props.helperText
        )
      }}
    />
  )
}
