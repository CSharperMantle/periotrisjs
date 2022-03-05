import { Link } from "gatsby"
import _ from "lodash"
import React from "react"

import MenuItem from "@mui/material/MenuItem"
import Typography from "@mui/material/Typography"

import type { IPageLocationElement } from "./CommonLayout"

interface IMenuPageLinkListProps {
  pageLocation: IPageLocationElement[]
  handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void
}

const MenuPageLinkList = (
  props: IMenuPageLinkListProps
): React.ReactElement => {
  return (
    <>
      {_.map(props.pageLocation, (page) => (
        <MenuItem key={page.name} onClick={props.handleCloseMenu}>
          <Typography
            textAlign="center"
            component={Link}
            to={page.path}
            sx={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {page.name}
          </Typography>
        </MenuItem>
      ))}
    </>
  )
}

export { MenuPageLinkList }
