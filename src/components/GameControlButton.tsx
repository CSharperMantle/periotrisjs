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
import {
  createStyles,
  Fab,
  makeStyles,
  PropTypes,
  Theme,
} from "@material-ui/core"

import { GameState } from "../model/GameState"
import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(5),
      right: theme.spacing(5),
    },
  })
})

interface IButtonLabelIconWrapper {
  icon: IconDefinition
}

function ButtonLabelIconWrapper(props: IButtonLabelIconWrapper) {
  const classes = useStyles()

  return <FontAwesomeIcon icon={props.icon} className={classes.extendedIcon} />
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
  const viewModel = useContext(PeriotrisViewModelContext)
  const styles = useStyles()

  const icon = getIconByGameState(viewModel.gameState, viewModel.paused)
  const isDisabled = viewModel.gameState === GameState.Preparing
  const color = getColorByGameState(viewModel.gameState)
  const label = getLabelByGameState(viewModel.gameState, viewModel.paused)

  return (
    <Fab
      className={styles.fab}
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
