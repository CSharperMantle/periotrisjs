import { isBrowser } from "is-in-browser"
import { SnackbarProvider } from "notistack"
import React, { useEffect, useRef } from "react"

import { Box } from "@mui/material"

import {
  BlocksGrid,
  CommonLayout,
  GameControlButton,
  PortraitWarningBackdrop,
  SnackbarPopper,
} from "../components"
import { GameViewModel, GameViewModelContext } from "../viewmodel"

const Hammer: HammerStatic = isBrowser ? require("hammerjs") : null

const App = (): React.ReactElement => {
  const viewModel = new GameViewModel()

  const rowTwoRef = useRef<HTMLElement>()
  let hammer: HammerManager

  useEffect(() => {
    window.addEventListener("keydown", viewModel.onKeyDown.bind(viewModel))

    hammer = new Hammer(rowTwoRef.current as HTMLElement)
    hammer.on("tap", viewModel.onTap.bind(viewModel))
    hammer.on("swipe", viewModel.onSwipe.bind(viewModel))
    hammer.on("pressup", viewModel.onPressUp.bind(viewModel))

    return () => {
      window.removeEventListener("keydown", viewModel.onKeyDown.bind(viewModel))

      hammer.off("tap", viewModel.onTap.bind(viewModel))
      hammer.off("swipe", viewModel.onSwipe.bind(viewModel))
      hammer.off("pressup", viewModel.onPressUp.bind(viewModel))
    }
  }, [])

  return (
    <GameViewModelContext.Provider value={viewModel}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            /* display-related props */
            display: "grid",
            gridTemplateRows: "1fr 80% 1fr",

            /* layouts: width, height, margin, padding, etc.*/
            position: "relative",
            height: "100%",
            minHeight: "0px",
            width: "100%",
            minWidth: "0px",
            boxSizing: "border-box",
            flex: "1 1 auto" /* For CommonLayout.tsx headers */,

            /* element-specific props */
            /* background-color to be filled */
          }}
        >
          <PortraitWarningBackdrop />
          <Box
            ref={rowTwoRef}
            sx={{
              gridRow: 2,
              position: "relative",
            }}
          >
            <BlocksGrid />
          </Box>
          <SnackbarPopper />
          <GameControlButton
            onClick={viewModel.invokeGameControl.bind(viewModel)}
          />
        </Box>
      </SnackbarProvider>
    </GameViewModelContext.Provider>
  )
}

App.Layout = CommonLayout

export default App
