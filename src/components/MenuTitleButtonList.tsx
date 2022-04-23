import { Link } from "gatsby"
import _ from "lodash"
import React from "react"

import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import type { IPageLocationElement } from "./CommonLayout"

interface IMenuTitleButtonListProps {
  pageLocation: IPageLocationElement[]
  handleCloseMenu: (event: React.MouseEvent<HTMLElement>) => void
}

export const MenuTitleButtonList = (
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
          <Box textAlign="center" margin="0 auto">
            {page.name}
          </Box>
        </Button>
      ))}
    </>
  )
}
