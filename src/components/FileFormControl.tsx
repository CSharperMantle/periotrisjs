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

import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import styled from "@mui/system/styled"

import { isNil } from "../common"

const HiddenInput = styled("input")({
  display: "none",
})

interface IFileUploadButtonProps {
  id: string
  accept: string
  multiple?: boolean
  caption: string
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUploadButton = ({
  id,
  accept,
  multiple,
  caption,
  onFileChange,
}: IFileUploadButtonProps): React.ReactElement => {
  return (
    <>
      <HiddenInput
        type="file"
        accept={accept}
        multiple={multiple}
        id={id}
        onChange={onFileChange}
      />
      <label htmlFor={id}>
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            height: "100%",
            minWidth: 0,
          }}
          component="span"
        >
          {caption}
        </Button>
      </label>
    </>
  )
}

interface IFileFormControlProps {
  id: string
  initialFileContent: string
  accept: string
  buttonCaption: string
  label: string
  helperText: string
  readOnly?: boolean
  onFileChange: (newContent: string) => boolean | void
  contentPreprocessor?: (content: string) => string
}

export const FileFormControl = ({
  id,
  initialFileContent,
  accept,
  buttonCaption,
  label,
  helperText,
  readOnly,
  onFileChange,
  contentPreprocessor,
}: IFileFormControlProps): React.ReactElement => {
  const [fileContent, setFileContent] = React.useState(initialFileContent)

  return (
    <FormControl>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          <TextField
            id={`${id}-string`}
            fullWidth
            value={fileContent}
            label={label}
            InputProps={{
              readOnly: readOnly,
            }}
            aria-describedby={`${id}-string-helper-text`}
          />
        </Grid>
        <Grid item xs={2}>
          <FileUploadButton
            id={`${id}-upload`}
            accept={accept}
            caption={buttonCaption}
            onFileChange={async (event) => {
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
            }}
          />
        </Grid>
      </Grid>
      <FormHelperText id={`${id}-string-helper-text`}>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}
