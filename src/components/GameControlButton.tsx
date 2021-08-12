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
  })
)

interface IButtonLabelIconWrapper {
  icon: IconDefinition
}

function ButtonLabelIconWrapper(props: IButtonLabelIconWrapper) {
  const classes = useButtonLabelIconStyles()

  return <FontAwesomeIcon icon={props.icon} className={classes.extendedIcon} />
}

interface IGameControlButtonProps {
  onClick: MouseEventHandler
}

const GameControlButton = observer(
  class GameControlButton extends React.Component<IGameControlButtonProps> {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      let icon: IconDefinition
      let isDisabled: boolean
      let color: PropTypes.Color
      let label: string
      switch (viewModel.gameState) {
        case GameState.NotStarted:
        case GameState.Lost:
        case GameState.Won:
          icon = faPlay
          isDisabled = false
          color = "primary"
          label = "start"
          break
        case GameState.InProgress:
          isDisabled = false
          color = "secondary"
          if (viewModel.paused) {
            icon = faPlay
            label = "resume"
          } else {
            icon = faPause
            label = "pause"
          }
          break
        case GameState.Preparing:
          icon = faClock
          isDisabled = true
          color = "primary"
          label = "preparing"
          break
        default:
          isDisabled = true
          icon = faQuestion
          color = "primary"
          label = "unknown"
          break
      }

      return (
        <Fab
          variant="extended"
          color={color}
          disabled={isDisabled}
          onClick={this.props.onClick}
          aria-label={label}
        >
          <ButtonLabelIconWrapper icon={icon} />
          {label}
        </Fab>
      )
    }
  }
)

export { GameControlButton }
