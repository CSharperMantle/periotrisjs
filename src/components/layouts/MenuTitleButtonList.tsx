import { Link } from "gatsby"
import _ from "lodash"
import React from "react"

import { Button } from "@mui/material"

import { PageLocationElement } from "./CommonLayout"

interface IMenuTitleButtonListProps {
  pageLocation: PageLocationElement[]
  handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void
}

const MenuTitleButtonList = (
  props: IMenuTitleButtonListProps
): React.ReactElement => {
  return (
    <>
      {_.map(props.pageLocation, (page) => (
        <Button
          key={page.name}
          onClick={props.handleCloseMenu}
          sx={{ my: 2, color: "white", display: "block" }}
          component={Link}
          to={page.path}
        >
          {page.name}
        </Button>
      ))}
    </>
  )
}

export { MenuTitleButtonList }
