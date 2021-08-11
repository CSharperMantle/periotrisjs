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

      let buttonLabelIcon: IconDefinition
      let buttonDisabled: boolean
      let buttonColor: PropTypes.Color
      let ariaLabel: string
      switch (viewModel.gameState) {
        case GameState.NotStarted:
        case GameState.Lost:
        case GameState.Won:
          buttonLabelIcon = faPlay
          buttonDisabled = false
          buttonColor = "primary"
          ariaLabel = "start"
          break
        case GameState.InProgress:
          buttonDisabled = false
          buttonColor = "secondary"
          if (viewModel.paused) {
            buttonLabelIcon = faPlay
            ariaLabel = "resume"
          } else {
            buttonLabelIcon = faPause
            ariaLabel = "pause"
          }
          break
        case GameState.Preparing:
          buttonLabelIcon = faClock
          buttonDisabled = true
          buttonColor = "primary"
          ariaLabel = "preparing"
          break
        default:
          buttonDisabled = true
          buttonLabelIcon = faQuestion
          buttonColor = "primary"
          ariaLabel = "unknown"
          break
      }

      return (
        <Fab
          variant="extended"
          color={buttonColor}
          disabled={buttonDisabled}
          onClick={this.props.onClick}
          aria-label={ariaLabel}
        >
          <ButtonLabelIconWrapper icon={buttonLabelIcon} />
          {ariaLabel}
        </Fab>
      )
    }
  }
)

export { GameControlButton }
