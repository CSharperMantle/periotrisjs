import _ from "lodash"
import React from "react"

import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import TextField from "@mui/material/TextField"

interface INumberFormControlProps {
  id: string
  initialContent: string
  label: string
  helperText: string
  adornments: {
    startAdornment?: React.ReactElement
    endAdornment?: React.ReactElement
  }
  step?: number
  min?: number
  max?: number
  onChange: (newContent: string) => boolean | void
  contentPreprocessor?: (content: string) => string
}

export const NumberFormControl = (
  props: INumberFormControlProps
): React.ReactElement => {
  const [content, setContent] = React.useState(props.initialContent)

  return (
    <FormControl>
      <TextField
        id={`${props.id}`}
        value={content}
        label={props.label}
        type="number"
        aria-describedby={`${props.id}-helper-text`}
        InputProps={{ ...props.adornments }}
        inputProps={{
          step: props.step,
          min: props.min,
          max: props.max,
        }}
        onChange={(event) => {
          const content = !_.isNil(props.contentPreprocessor)
            ? props.contentPreprocessor(event.target.value)
            : event.target.value
          const result = props.onChange(content)
          if (_.isNil(result) || result) {
            setContent(content)
          }
        }}
      />
      <FormHelperText id={`${props.id}-helper-text`}>
        {props.helperText}
      </FormHelperText>
    </FormControl>
  )
}
