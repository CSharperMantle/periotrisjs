import { observer } from "mobx-react"
import React, { useContext, useState } from "react"

import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  AppBar,
  createStyles,
  Drawer,
  IconButton,
  makeStyles,
  Slide,
  Theme,
  Toolbar,
  Typography,
} from "@material-ui/core"

import { GameState } from "../model/GameState"
import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
)

const MainAppBar = observer((): React.ReactElement => {
  const styles = useStyles()
  const viewModel = useContext(PeriotrisViewModelContext)
  const [drawerOpenState, setDrawerOpenState] = useState(false)

  const switchDrawer = (open: boolean): void => {
    setDrawerOpenState(open)
  }

  return (
    <>
      <div className={styles.root}>
        <Slide
          direction="down"
          in={viewModel.gameState !== GameState.InProgress}
        >
          <AppBar position="sticky">
            <Toolbar>
              <IconButton
                className={styles.menuButton}
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => {
                  switchDrawer(true)
                }}
              >
                <FontAwesomeIcon icon={faBars} />
              </IconButton>
              <Typography className={styles.title} variant="h6">
                Periotris.js
              </Typography>
            </Toolbar>
          </AppBar>
        </Slide>
      </div>
      <Drawer
        anchor="left"
        open={drawerOpenState}
        onClose={() => {
          switchDrawer(false)
        }}
      ></Drawer>
    </>
  )
})

export { MainAppBar }
