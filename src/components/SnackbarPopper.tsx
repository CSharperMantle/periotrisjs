import { useSnackbar } from "notistack"
import React, { useContext, useEffect } from "react"
import _ from "lodash"

import { GameState } from "../model/GameState"
import { GameViewModelContext } from "../viewmodel"

const SnackbarPopper = (): React.ReactElement => {
  const viewModel = useContext(GameViewModelContext)
  const notistack = useSnackbar()

  const onGameStateChangedHandler = _.debounce(
    () => {
      switch (viewModel.gameState) {
        case GameState.Won:
          notistack.enqueueSnackbar("Game won. Congrats!", {
            variant: "success",
          })
          break
        case GameState.Lost:
          notistack.enqueueSnackbar("Game lost. Try again!", {
            variant: "info",
          })
          break
        default:
          break
      }
    },
    1000,
    {
      leading: true,
      trailing: false,
    }
  )

  useEffect(() => {
    // Set up event listener
    viewModel.addListener("gamestatechanged", onGameStateChangedHandler)
    return () => {
      // Tear down event listener
      viewModel.removeListener("gamestatechanged", onGameStateChangedHandler)
    }
  }, [])

  return <></>
}

export { SnackbarPopper }
