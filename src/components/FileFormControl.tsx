import _ from "lodash"
import React from "react"

import Button from "@mui/material/Button"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import styled from "@mui/system/styled"

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

const FileFormControl = ({
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
              let content = !_.isNil(event.target.files)
                ? await event.target.files[0].text()
                : ""
              content = !_.isNil(contentPreprocessor)
                ? contentPreprocessor(content)
                : content
              const result = onFileChange(content)
              if (_.isNil(result) || result) {
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

export { FileFormControl }
