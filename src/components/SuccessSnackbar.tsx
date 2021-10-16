import React from "react"

import { Alert, Snackbar } from "@mui/material"

import { GameState } from "../model"
import { PeriotrisViewModelContext } from "../viewmodel"

interface ISuccessSnackbarProps {
  goOutTimeout: number
}

interface ISuccessSnackbarState {
  isOpen: boolean
}

class SuccessSnackbar extends React.Component<
  ISuccessSnackbarProps,
  ISuccessSnackbarState
> {
  static contextType = PeriotrisViewModelContext
  declare context: React.ContextType<typeof PeriotrisViewModelContext>

  public constructor(props: ISuccessSnackbarProps) {
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
        <Alert severity="success">You won the game!</Alert>
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
      isOpen: this.context.gameState === GameState.Won,
    })

    setTimeout(() => {
      this.setState({
        isOpen: false,
      })
    }, this.props.goOutTimeout)
  }
}

export { SuccessSnackbar }
