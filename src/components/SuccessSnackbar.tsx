import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const SuccessSnackbar = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)

  return (
    <Snackbar open={viewModel.gameWon}>
      <Alert severity="success">You won the game!</Alert>
    </Snackbar>
  )
})

export { SuccessSnackbar }
