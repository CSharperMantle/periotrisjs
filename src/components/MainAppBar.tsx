import React from "react"

import FavoriteIcon from "@mui/icons-material/Favorite"
import GitHubIcon from "@mui/icons-material/GitHub"
import {
  AppBar,
  Box,
  Container,
  Menu,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material"

import PageLocation from "../json/PageLocation.json"
import { IconExternalLink } from "./IconExternalLink"
import { MenuButton } from "./MenuButton"
import { MenuPageLinkList } from "./MenuPageLinkList"
import { MenuTitleButtonList } from "./MenuTitleButtonList"

const MainAppBar = (): React.ReactElement => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
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
          <Box sx={{ flex: "1 1 0", display: { xs: "flex", md: "none" } }}>
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
            sx={{ flex: "1 1 0", display: { xs: "flex", md: "none" } }}
          >
            <Box sx={{ margin: "0 auto" }}>Periotris.js</Box>
          </Typography>
          <Box sx={{ flex: "1 1 auto", display: { xs: "none", md: "flex" } }}>
            <MenuTitleButtonList
              pageLocation={PageLocation}
              handleCloseMenu={handleCloseNavMenu}
            />
          </Box>
          <Stack
            sx={{ flex: "1 1 0" }}
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <IconExternalLink
              ariaLabel="sponsor"
              href="https://afdian.net/@CSharperMantle"
              tooltipTitle="Sponsor the author"
              icon={<FavoriteIcon />}
            />
            <IconExternalLink
              ariaLabel="github"
              href="https://github.com/CSharperMantle/periotrisjs"
              tooltipTitle="Open GitHub repository"
              icon={<GitHubIcon />}
            />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export { MainAppBar }
