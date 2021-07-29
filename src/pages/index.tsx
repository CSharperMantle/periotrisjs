import React from "react"
import "./index.css"
import { PeriotrisViewModel } from "../viewmodel/PeriotrisViewModel"
import { BlocksGrid } from "../components/BlocksGrid"

class App extends React.Component<{}, {}> {
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
      <main className="game-page">
        <div
          className="play-area"
          onClick={this._viewModel.startGame.bind(this._viewModel)}
        >
          <BlocksGrid blocksList={this._viewModel.sprites} />
        </div>
      </main>
    )
  }
}

export default App
