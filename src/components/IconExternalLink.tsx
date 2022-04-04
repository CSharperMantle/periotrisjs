import React from "react"

import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"

interface IIconExternalLinkProps {
  icon: JSX.Element
  ariaLabel: string
  tooltipTitle: string
  href: string
}

const IconExternalLink = (
  props: IIconExternalLinkProps
): React.ReactElement => {
  return (
    <Tooltip title={`${props.tooltipTitle}`}>
      <IconButton
        aria-label={`${props.ariaLabel}`}
        href={`${props.href}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.icon}
      </IconButton>
    </Tooltip>
  )
}

export { IconExternalLink }
