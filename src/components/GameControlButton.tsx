import { observer } from "mobx-react"
import React, { MouseEventHandler, useContext } from "react"

import {
  faClock,
  faPause,
  faPlay,
  faQuestion,
  faRedo,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Box, Fab, PropTypes, useTheme } from "@mui/material"

import { GameState } from "../model"
import { PeriotrisViewModelContext } from "../viewmodel"

interface IButtonLabelIconWrapper {
  icon: IconDefinition
}

function ButtonLabelIconWrapper(props: IButtonLabelIconWrapper) {
  return (
    <Box
      sx={{
        marginRight: 1,
      }}
    >
      <FontAwesomeIcon icon={props.icon} />
    </Box>
  )
}

interface IGameControlButtonProps {
  onClick: MouseEventHandler
}

function getIconByGameState(
  gameState: GameState,
  paused: boolean
): IconDefinition {
  switch (gameState) {
    case GameState.NotStarted:
      return faPlay
    case GameState.Lost:
    case GameState.Won:
      return faRedo
    case GameState.InProgress:
      if (paused) {
        return faPlay
      } else {
        return faPause
      }
    case GameState.Preparing:
      return faClock
    default:
      return faQuestion
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

const GameControlButton = observer(({ onClick }: IGameControlButtonProps) => {
  const theme = useTheme()
  const viewModel = useContext(PeriotrisViewModelContext)

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
      <ButtonLabelIconWrapper icon={icon} />
      {label}
    </Fab>
  )
})

export { GameControlButton }
