import "./GameControlButton.css"

import { observer } from "mobx-react"
import React, { MouseEventHandler } from "react"

import {
  faClock,
  faPause,
  faPlay,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  createStyles,
  Fab,
  makeStyles,
  PropTypes,
  Theme,
  WithTheme,
  withTheme,
} from "@material-ui/core"

import { GameState } from "../model/GameState"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

const useButtonLabelIconStyles = makeStyles((theme: Theme) =>
  createStyles({
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    fab: {
      bottom: theme.spacing(1),
      right: theme.spacing(1),
    },
  })
)

interface IButtonLabelIconWrapper {
  icon: IconDefinition
}

function ButtonLabelIconWrapper(props: IButtonLabelIconWrapper) {
  const classes = useButtonLabelIconStyles()

  return <FontAwesomeIcon icon={props.icon} className={classes.extendedIcon} />
}

interface IGameControlButtonProps extends WithTheme {
  onClick: MouseEventHandler
}

function getIconByGameState(
  gameState: GameState,
  paused: boolean
): IconDefinition {
  switch (gameState) {
    case GameState.NotStarted:
    case GameState.Lost:
    case GameState.Won:
      return faPlay
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
    case GameState.Lost:
    case GameState.Won:
      return "start"
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

const GameControlButton = withTheme(
  observer(
    class GameControlButton extends React.Component<IGameControlButtonProps> {
      static contextType = PeriotrisViewModelContext
      declare context: React.ContextType<typeof PeriotrisViewModelContext>

      public render() {
        const viewModel: PeriotrisViewModel = this.context

        let icon: IconDefinition = getIconByGameState(
          viewModel.gameState,
          viewModel.paused
        )
        let isDisabled: boolean = viewModel.gameState === GameState.Preparing
        let color: PropTypes.Color = getColorByGameState(viewModel.gameState)
        let label: string = getLabelByGameState(
          viewModel.gameState,
          viewModel.paused
        )

        return (
          <Fab
            className="game-control-button"
            variant="extended"
            color={color}
            disabled={isDisabled}
            onClick={this.props.onClick}
            aria-label={label}
            style={{
              bottom: this.props.theme.spacing(5),
              right: this.props.theme.spacing(5),
            }}
          >
            <ButtonLabelIconWrapper icon={icon} />
            {label}
          </Fab>
        )
      }
    }
  )
)

export { GameControlButton }
