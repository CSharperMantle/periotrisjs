import "./index.css"

import React from "react"

import { AppStartSplash } from "../components/AppStartSplash"
import { BlocksGrid } from "../components/BlocksGrid"
import { FailedSnackbar } from "../components/FailedSnackbar"
import { GameControlButton } from "../components/GameControlButton"
import { SuccessBanner } from "../components/SuccessBanner"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"

class App extends React.Component {
  private _viewModel: PeriotrisViewModel = new PeriotrisViewModel()

  public constructor(props: {}) {
    super(props)
  }

  public componentDidMount(): void {
    window.addEventListener(
      "keydown",
      this._viewModel.onKeyDown.bind(this._viewModel)
    )
  }

  public componentWillUnmount(): void {
    window.removeEventListener(
      "keydown",
      this._viewModel.onKeyDown.bind(this._viewModel)
    )
  }

  public render() {
    return (
      <PeriotrisViewModelContext.Provider value={this._viewModel}>
        <main className="game-page">
          <div className="game-page__row-1">
            <SuccessBanner />
          </div>
          <div className="game-page__row-2">
            <BlocksGrid />
            <AppStartSplash goOutTimeout={3000} />
          </div>
          <FailedSnackbar />
          <GameControlButton
            onClick={this._viewModel.invokeGameControl.bind(this._viewModel)}
          />
        </main>
      </PeriotrisViewModelContext.Provider>
    )
  }
}

export default App
