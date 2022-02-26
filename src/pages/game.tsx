import { isBrowser } from "is-in-browser"
import _ from "lodash"
import React, { useEffect, useRef } from "react"

import { Box } from "@mui/material"

import { BlocksGrid, CommonLayout, GameControlBackdrop } from "../components"
import { GameViewModel, GameViewModelContext } from "../viewmodel"

const Hammer: HammerStatic = isBrowser ? require("hammerjs") : null

const App = (): React.ReactElement => {
  const viewModel = new GameViewModel()

  const rowTwoRef = useRef<HTMLElement>()
  let hammer: HammerManager

  useEffect(() => {
    const throttledKeyDownHandler = _.throttle(
      viewModel.onKeyDown.bind(viewModel),
      50
    )
    const throttledTapHandler = _.throttle(viewModel.onTap.bind(viewModel), 50)
    const throttledSwipeHandler = _.throttle(
      viewModel.onSwipe.bind(viewModel),
      50
    )
    const throttledPressUpHandler = _.throttle(
      viewModel.onPressUp.bind(viewModel),
      50
    )

    window.addEventListener("keydown", throttledKeyDownHandler)

    hammer = new Hammer(rowTwoRef.current as HTMLElement)
    hammer.on("tap", throttledTapHandler)
    hammer.on("swipe", throttledSwipeHandler)
    hammer.on("pressup", throttledPressUpHandler)

    return () => {
      window.removeEventListener("keydown", throttledKeyDownHandler)
      hammer.off("tap", throttledTapHandler)
      hammer.off("swipe", throttledSwipeHandler)
      hammer.off("pressup", throttledPressUpHandler)
    }
  }, [])

  return (
    <GameViewModelContext.Provider value={viewModel}>
      <Box
        sx={{
          /* display-related props */
          display: "grid",
          gridTemplateRows: "1fr 90% 1fr",

          /* layouts: width, height, margin, padding, etc.*/
          position: "relative",
          height: "100%",
          minHeight: "0px",
          width: "100%",
          minWidth: "0px",
          boxSizing: "border-box",
          flex: "1 1 auto" /* For CommonLayout.tsx headers */,

          /* element-specific props */
        }}
      >
        <GameControlBackdrop
          startGameHandler={viewModel.requestStartGame.bind(viewModel)}
          switchPauseGameHandler={viewModel.switchPauseGame.bind(viewModel)}
        />
        <Box
          ref={rowTwoRef}
          sx={{
            gridRow: 2,
            position: "relative",
          }}
        >
          <BlocksGrid />
        </Box>
      </Box>
    </GameViewModelContext.Provider>
  )
}

App.Layout = CommonLayout

export default App