import React from "react"
import "./index.css"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"
import { BlocksGrid } from "../components/BlocksGrid"
import { StartGamePanel } from "../components/StartGamePanel"

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
          <div className="game-page__row-2">
            <div
              className="play-area"
              onClick={this._viewModel.startGame.bind(this._viewModel)}
            >
              <BlocksGrid />
            </div>
            <StartGamePanel />
          </div>
        </main>
      </PeriotrisViewModelContext.Provider>
    )
  }
}

export default App
