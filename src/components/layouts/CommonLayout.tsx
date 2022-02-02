import "./CommonLayout.css"

import React from "react"

import { GitHub as GitHubIcon } from "@mui/icons-material"
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material"

import PageLocation from "../../json/PageLocation.json"
import { MenuButton } from "./MenuButton"
import { MenuPageLinkList } from "./MenuPageLinkList"
import { MenuTitleButtonList } from "./MenuTitleButtonList"

export interface PageLocationElement {
  name: string
  path: string
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
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open on GitHub">
                <IconButton
                  aria-label="github"
                  href="https://github.com/CSharperMantle/periotrisjs/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {props.children}
    </Box>
  )
}

export { CommonLayout }
