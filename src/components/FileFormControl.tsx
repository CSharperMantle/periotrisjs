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

import React, { useRef } from "react"

import FileOpenIcon from "@mui/icons-material/FileOpen"
import Container from "@mui/material/Container"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import IconButton from "@mui/material/IconButton"
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
  readonly onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploadButton = ({
  id,
  accept,
  multiple,
  tooltipCaption,
  onFileChange,
}: IFileUploadButtonProps): React.ReactElement => {
  const hiddenFileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <HiddenInput
        type="file"
        accept={accept}
        multiple={multiple}
        id={id}
        onChange={onFileChange}
        ref={hiddenFileInputRef}
      />
      <Tooltip title={tooltipCaption}>
        <IconButton
          color="primary"
          size="large"
          onClick={() => {
            hiddenFileInputRef?.current?.click()
          }}
        >
          <FileOpenIcon />
        </IconButton>
      </Tooltip>
    </>
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
  readonly onFileChange: (newContent: string) => boolean | void
  readonly contentPreprocessor?: (content: string) => string
}

export const FileFormControl = ({
  id,
  initialFileContent,
  accept,
  tooltipCaption,
  label,
  helperText,
  readOnly,
  onFileChange,
  contentPreprocessor,
}: IFileFormControlProps): React.ReactElement => {
  const [fileContent, setFileContent] = React.useState(initialFileContent)

  const onFileChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let content = !isNil(event.target.files)
      ? await event.target.files[0].text()
      : ""
    content = !isNil(contentPreprocessor)
      ? contentPreprocessor(content)
      : content
    const result = onFileChange(content)
    if (isNil(result) || result) {
      setFileContent(content)
    }
  }

  return (
    <FormControl>
      <Grid container spacing={0} direction="row" alignItems="center">
        <Grid item xs={10}>
          <TextField
            id={`${id}-string`}
            fullWidth
            value={fileContent}
            label={label}
            InputProps={{
              readOnly: readOnly ?? false,
            }}
            aria-describedby={`${id}-string-helper-text`}
          />
        </Grid>
        <Grid item xs={2}>
          <Container maxWidth="sm">
            <FileUploadButton
              id={`${id}-upload`}
              accept={accept}
              tooltipCaption={tooltipCaption}
              onFileChange={onFileChangeHandler}
            />
          </Container>
        </Grid>
      </Grid>
      <FormHelperText id={`${id}-string-helper-text`}>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}
