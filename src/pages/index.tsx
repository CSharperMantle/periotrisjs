import "./index.css"

import React from "react"

import { isBrowserEnv } from "../common"
import {
  AppStartSplash,
  BlocksGrid,
  FailedSnackbar,
  GameControlButton,
  PortraitWarningBackdrop,
  SuccessSnackbar,
} from "../components"
import { PeriotrisViewModel, PeriotrisViewModelContext } from "../viewmodel"

const Hammer = isBrowserEnv() ? require("hammerjs") : null

class App extends React.Component {
  private readonly _viewModel: PeriotrisViewModel = new PeriotrisViewModel()
  private readonly _rowTwoRef: React.RefObject<HTMLDivElement> =
    React.createRef<HTMLDivElement>()
  private _hammer: HammerManager

  public constructor(props: Record<string, never>) {
    super(props)
  }

  public componentDidMount(): void {
    window.addEventListener(
      "keydown",
      this._viewModel.onKeyDown.bind(this._viewModel)
    )

    this._hammer = new Hammer(this._rowTwoRef.current)
    this._hammer.on("tap", this._viewModel.onTap.bind(this._viewModel))
    this._hammer.on("swipe", this._viewModel.onSwipe.bind(this._viewModel))
    this._hammer.on("pressup", this._viewModel.onPressUp.bind(this._viewModel))
  }

  public componentWillUnmount(): void {
    window.removeEventListener(
      "keydown",
      this._viewModel.onKeyDown.bind(this._viewModel)
    )

    this._hammer.off("tap", this._viewModel.onTap.bind(this._viewModel))
    this._hammer.off("swipe", this._viewModel.onSwipe.bind(this._viewModel))
    this._hammer.off("pressup", this._viewModel.onPressUp.bind(this._viewModel))
  }

  public render(): React.ReactElement {
    return (
      <PeriotrisViewModelContext.Provider value={this._viewModel}>
        <main className="game-page">
          <PortraitWarningBackdrop />
          <div className="game-page__row-2" ref={this._rowTwoRef}>
            <BlocksGrid />
            <AppStartSplash goOutTimeout={3000} />
          </div>
          <FailedSnackbar goOutTimeout={3000} />
          <SuccessSnackbar goOutTimeout={3000} />
          <GameControlButton
            onClick={this._viewModel.invokeGameControl.bind(this._viewModel)}
          />
        </main>
      </PeriotrisViewModelContext.Provider>
    )
  }
}

export default App
