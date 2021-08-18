import { observer } from "mobx-react"
import React, { useContext } from "react"

import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

import { PeriotrisViewModelContext } from "../viewmodel/PeriotrisViewModel"

const FailedSnackbar = observer((): React.ReactElement => {
  const viewModel = useContext(PeriotrisViewModelContext)

  return (
    <Snackbar open={viewModel.gameLost}>
      <Alert severity="error">You lost the game.</Alert>
    </Snackbar>
  )
})

export { FailedSnackbar }
