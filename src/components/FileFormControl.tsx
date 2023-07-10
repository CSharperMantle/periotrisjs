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

import { head } from "lodash"
import React, { useRef } from "react"

import FileOpenIcon from "@mui/icons-material/FileOpen"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import styled from "@mui/system/styled"

import { isNil } from "../common"

const HiddenInput = styled("input")({
  display: "none",
})

interface IFileUploadButtonProps {
  readonly id: string
  readonly accept: string
  readonly multiple?: boolean
  readonly tooltipCaption: string
  readonly disabled?: boolean
  readonly onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploadButton = (props: IFileUploadButtonProps) => {
  const hiddenFileInputRef = useRef<HTMLInputElement>(null)

  return (
    <Stack direction="row" justifyItems="center" alignItems="center">
      <Tooltip title={props.tooltipCaption}>
        <IconButton
          size="large"
          disabled={props.disabled ?? false}
          onClick={() => {
            hiddenFileInputRef?.current?.click()
          }}
          sx={{ margin: "0 auto" }}
        >
          <FileOpenIcon />
        </IconButton>
      </Tooltip>
      <HiddenInput
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        id={props.id}
        onChange={props.onFileChange}
        ref={hiddenFileInputRef}
      />
    </Stack>
  )
}

interface IFileFormControlProps {
  readonly id: string
  readonly initialFileContent: string
  readonly accept: string
  readonly tooltipCaption: string
  readonly label: string
  readonly helperText: string
  readonly readOnly?: boolean
  readonly disabled?: boolean
  readonly onFileChange: (newContent: string) => boolean | void
  readonly contentPreprocessor?: (content: string) => string
}

export const FileFormControl = (props: IFileFormControlProps) => {
  const [fileContent, setFileContent] = React.useState(props.initialFileContent)
  const [error, setError] = React.useState(false)

  return (
    <Grid container spacing={0} direction="row" alignItems="center">
      <Grid item xs={10}>
        <TextField
          id={`${props.id}-string`}
          fullWidth
          value={fileContent}
          label={props.label}
          helperText={props.helperText}
          disabled={props.disabled ?? false}
          error={error}
          InputProps={{
            readOnly: props.readOnly ?? false,
          }}
        />
      </Grid>
      <Grid item xs={2}>
        <FileUploadButton
          id={`${props.id}-upload`}
          accept={props.accept}
          tooltipCaption={props.tooltipCaption}
          disabled={props.disabled ?? false}
          onFileChange={async (event) => {
            let content = (await head(event.target.files)?.text()) ?? ""
            content = props.contentPreprocessor?.(content) ?? content
            const result = props.onFileChange(content)
            const isSuccessful = isNil(result) || result
            setFileContent(content)
            setError(!isSuccessful)
          }}
        />
      </Grid>
    </Grid>
  )
}
