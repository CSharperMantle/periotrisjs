import "./GameControlButton.css"

import { observer } from "mobx-react"
import React, { MouseEventHandler } from "react"

import {
  faClock,
  faPause,
  faPlay,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, PropTypes } from "@material-ui/core"

import { GameState } from "../model/GameState"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

interface IGameControlButtonProps {
  onClick: MouseEventHandler
}

const GameControlButton = observer(
  class GameControlButton extends React.Component<IGameControlButtonProps> {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      let buttonLabelElement: JSX.Element
      let buttonDisabled: boolean
      let buttonColor: PropTypes.Color
      switch (viewModel.gameState) {
        case GameState.NotStarted:
        case GameState.Lost:
        case GameState.Won:
          buttonLabelElement = <FontAwesomeIcon icon={faPlay} />
          buttonDisabled = false
          buttonColor = "primary"
          break
        case GameState.InProgress:
          buttonDisabled = false
          buttonColor = "secondary"
          if (viewModel.paused) {
            buttonLabelElement = <FontAwesomeIcon icon={faPlay} />
          } else {
            buttonLabelElement = <FontAwesomeIcon icon={faPause} />
          }
          break
        case GameState.Preparing:
          buttonLabelElement = <FontAwesomeIcon icon={faClock} />
          buttonDisabled = true
          buttonColor = "primary"
          break
        default:
          buttonLabelElement = <FontAwesomeIcon icon={faQuestion} />
          buttonDisabled = true
          buttonColor = "primary"
          break
      }

      return (
        <Button
          variant="contained"
          className="game-control-button"
          color={buttonColor}
          disabled={buttonDisabled}
          onClick={this.props.onClick}
        >
          {buttonLabelElement}
        </Button>
      )
    }
  }
)

export { GameControlButton }
