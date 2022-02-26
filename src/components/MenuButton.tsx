import React from "react"

import MenuIcon from "@mui/icons-material/Menu"
import { IconButton } from "@mui/material"

interface IMenuButtonProps {
  handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void
}

const MenuButton = (props: IMenuButtonProps): React.ReactElement => {
  return (
    <IconButton
      size="large"
      aria-label="account of current user"
      aria-controls="menu-app-bar"
      aria-haspopup="true"
      onClick={props.handleOpenMenu}
      color="inherit"
    >
      <MenuIcon />
    </IconButton>
  )
}

export { MenuButton }
