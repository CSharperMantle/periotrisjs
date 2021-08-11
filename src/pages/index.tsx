import "./index.css"

import React from "react"

import { Grid } from "@material-ui/core"

import { AppStartSplash } from "../components/AppStartSplash"
import { BlocksGrid } from "../components/BlocksGrid"
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
            <div className="play-area">
              <BlocksGrid />
            </div>
            <AppStartSplash goOutTimeout={3000} />
          </div>
          <div className="game-page__row-3">
            <Grid
              container
              className="game-page__row-3__container"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <GameControlButton
                  onClick={this._viewModel.invokeGameControl.bind(
                    this._viewModel
                  )}
                />
              </Grid>
            </Grid>
          </div>
        </main>
      </PeriotrisViewModelContext.Provider>
    )
  }
}

export default App
