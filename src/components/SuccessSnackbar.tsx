import { observer } from "mobx-react"
import React from "react"

import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

const SuccessSnackbar = observer(
  class SuccessSnackbar extends React.Component {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      return (
        <Snackbar open={viewModel.gameWon}>
          <Alert severity="success">You won the game!</Alert>
        </Snackbar>
      )
    }
  }
)

export { SuccessSnackbar }
