import React from "react"
import "./index.css"
import { PeriotrisViewModel } from "../viewmodel/PeriotrisViewModel"
import { BlocksGrid } from "../components/BlocksGrid"

class App extends React.Component<{}, {}> {
  private _viewModel: PeriotrisViewModel = new PeriotrisViewModel()

  public constructor(props: {}) {
    super(props)
  }

  public render() {
    return (
      <main className="game-page" onKeyDown={this._viewModel.onKeyDown}>
        <div
          className="play-area"
          onClick={() => {
            this._viewModel.test()
          }}
        >
          <BlocksGrid blocksList={this._viewModel.sprites} />
        </div>
      </main>
    )
  }
}

export default App
