import "./CommonLayout.css"

import React from "react"

import { Menu as MenuIcon } from "@mui/icons-material"
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Typography,
} from "@mui/material"

import PageLocation from "../../json/PageLocation.json"
import { MenuPageLinkList } from "./MenuPageLinkList"
import { MenuTitleButtonList } from "./MenuTitleButtonList"

export interface PageLocationElement {
  name: string
  path: string
}

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

interface ICommonLayoutProps {
  children: React.ReactNode
}

const CommonLayout = (props: ICommonLayoutProps): React.ReactElement => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "column nowrap",
        minHeight: "100vh",
        maxHeight: "100vh",
      }}
    >
      <AppBar
        position="static"
        sx={{
          flex: "0 1 auto",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
            >
              Periotris.js
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <MenuButton handleOpenMenu={handleOpenNavMenu} />
              <Menu
                id="menu-app-bar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuPageLinkList
                  pageLocation={PageLocation}
                  handleCloseMenu={handleCloseNavMenu}
                />
              </Menu>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              Periotris.js
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              <MenuTitleButtonList
                pageLocation={PageLocation}
                handleCloseMenu={handleCloseNavMenu}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {props.children}
    </Box>
  )
}

export { CommonLayout }
