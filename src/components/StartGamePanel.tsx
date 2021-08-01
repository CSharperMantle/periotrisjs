import { Container, Fade, Paper, Typography } from "@material-ui/core"
import { observer } from "mobx-react"
import React from "react"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"
import "./StartGamePanel.css"

interface IStartGamePanelProps {}

const StartGamePanel = observer(
  class StartGamePanel extends React.Component<IStartGamePanelProps> {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public constructor(props: IStartGamePanelProps) {
      super(props)
    }

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      return (
        <Fade in={viewModel.gameOver}>
          <Paper
            className="start-game-panel"
            elevation={3}
            onClick={viewModel.startGame.bind(viewModel)}
          ></Paper>
        </Fade>
      )
    }
  }
)

export { StartGamePanel }
