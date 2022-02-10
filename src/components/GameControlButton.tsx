import { observer } from "mobx-react"
import React, { MouseEventHandler, useContext } from "react"

import {
  HourglassFull as HourglassFullIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  QuestionMark as QuestionMarkIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material"
import { Fab, PropTypes, useTheme } from "@mui/material"

import { GameState } from "../model"
import { GameViewModelContext } from "../viewmodel"

function getIconByGameState(
  gameState: GameState,
  paused: boolean
): JSX.Element {
  switch (gameState) {
    case GameState.NotStarted:
      return <PlayArrowIcon sx={{ mr: 1 }} />
    case GameState.Lost:
    case GameState.Won:
      return <ReplayIcon sx={{ mr: 1 }} />
    case GameState.InProgress:
      if (paused) {
        return <PlayArrowIcon sx={{ mr: 1 }} />
      } else {
        return <PauseIcon sx={{ mr: 1 }} />
      }
    case GameState.Preparing:
      return <HourglassFullIcon sx={{ mr: 1 }} />
    default:
      return <QuestionMarkIcon sx={{ mr: 1 }} />
  }
}

function getColorByGameState(gameState: GameState): PropTypes.Color {
  switch (gameState) {
    case GameState.InProgress:
      return "secondary"
    default:
      return "primary"
  }
}

function getLabelByGameState(gameState: GameState, paused: boolean): string {
  switch (gameState) {
    case GameState.NotStarted:
      return "start"
    case GameState.Lost:
    case GameState.Won:
      return "restart"
    case GameState.InProgress:
      if (paused) {
        return "resume"
      } else {
        return "pause"
      }
    case GameState.Preparing:
      return "preparing"
    default:
      return "unknown"
  }
}

interface IGameControlButtonProps {
  onClick: MouseEventHandler
}

const GameControlButton = observer(({ onClick }: IGameControlButtonProps) => {
  const theme = useTheme()
  const viewModel = useContext(GameViewModelContext)

  const icon = getIconByGameState(viewModel.gameState, viewModel.paused)
  const isDisabled = viewModel.gameState === GameState.Preparing
  const color = getColorByGameState(viewModel.gameState)
  const label = getLabelByGameState(viewModel.gameState, viewModel.paused)

  return (
    <Fab
      sx={{
        position: "absolute",
        bottom: theme.spacing(5),
        right: theme.spacing(5),
      }}
      variant="extended"
      color={color}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={label}
    >
      {icon}
      {label}
    </Fab>
  )
})

export { GameControlButton }
