import React from "react"

import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

import { GameState } from "../model/GameState"
import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

interface IFailedSnackbarProps {
  goOutTimeout: number
}

interface IFailedSnackbarState {
  isOpen: boolean
}

class FailedSnackbar extends React.Component<
  IFailedSnackbarProps,
  IFailedSnackbarState
> {
  static contextType = PeriotrisViewModelContext
  declare context: React.ContextType<typeof PeriotrisViewModelContext>

  public constructor(props: IFailedSnackbarProps) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  public componentDidMount(): void {
    this.context.addListener(
      "gamestatechanged",
      this.onGameStateChangedHandler.bind(this)
    )
  }

  public render(): React.ReactElement {
    return (
      <Snackbar open={this.state.isOpen}>
        <Alert severity="error">You lost the game.</Alert>
      </Snackbar>
    )
  }

  public componentWillUnmount(): void {
    this.context.removeListener(
      "gamestatechanged",
      this.onGameStateChangedHandler.bind(this)
    )
  }

  private onGameStateChangedHandler(): void {
    this.setState({
      isOpen: this.context.gameState === GameState.Lost,
    })

    setTimeout(() => {
      this.setState({
        isOpen: false,
      })
    }, this.props.goOutTimeout)
  }
}

export { FailedSnackbar }
