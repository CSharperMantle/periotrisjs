/*
 * Copyright (C) 2021-present Rong "Mantle" Bao
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/ .
 */

import { throttle } from "lodash"
import React, { useEffect } from "react"

import { useDrag } from "@use-gesture/react"

import Box from "@mui/material/Box"

import { flushed } from "../common"
import { BlocksGrid, CommonHead, GameControlBackdrop } from "../components"
import { GameViewModel } from "../viewmodel"

const App = (): React.ReactElement => {
  const viewModel = new GameViewModel()

  const onKeyDownThrottled = throttle(
    flushed(viewModel.onKeyDown.bind(viewModel)),
    50
  )
  const onTapThrottled = throttle(flushed(viewModel.onTap.bind(viewModel)), 50)
  const onSwipeThrottled = throttle(
    flushed(viewModel.onSwipe.bind(viewModel)),
    50
  )

  useEffect(() => {
    window.addEventListener("keydown", onKeyDownThrottled)
    return () => {
      window.removeEventListener("keydown", onKeyDownThrottled)
    }
  }, [])

  const gestureBind = useDrag(
    ({ swipe, tap, elapsedTime }) => {
      if (tap) {
        onTapThrottled(elapsedTime)
      } else {
        onSwipeThrottled(swipe)
      }
    },
    {
      filterTaps: true,
      swipe: {
        /* TODO: Add these to customization settings! */
        distance: [30, 30],
        duration: 1500,
      },
    }
  )

  return (
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
        sx={{
          gridRow: 2,
          position: "relative",
        }}
        {...gestureBind()}
      >
        <BlocksGrid />
      </Box>
    </Box>
  )
}

export default App

export const Head = CommonHead
