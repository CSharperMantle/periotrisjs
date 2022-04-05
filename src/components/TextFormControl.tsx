import React from "react"

import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import _ from "lodash"
import FormHelperText from "@mui/material/FormHelperText"

interface ITextFormControlProps {
  id: string
  initialTextContent: string
  label: string
  helperText: string
  type: string
  readOnly?: boolean
  onContentChange: (newContent: string) => boolean | void
  contentPreprocessor?: (content: string) => string
}

// FIXME: Unused
const TextFormControl = ({
  id,
  initialTextContent,
  label,
  helperText,
  type,
  readOnly,
  onContentChange,
  contentPreprocessor,
}: ITextFormControlProps): React.ReactElement => {
  const [textContent, setTextContent] = React.useState(initialTextContent)

  return (
    <FormControl>
      <TextField
        id={`${id}`}
        value={textContent}
        label={label}
        InputProps={{
          readOnly,
        }}
        type={type}
        aria-describedby={`${id}-helper-text`}
        onChange={(event) => {
          let content = event.target.value
          content = !_.isNil(contentPreprocessor)
            ? contentPreprocessor(content)
            : content
          const result = onContentChange(content)
          if (_.isNil(result) || result) {
            setTextContent(content)
          }
        }}
      />
      <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText>
    </FormControl>
  )
}

export { TextFormControl }
