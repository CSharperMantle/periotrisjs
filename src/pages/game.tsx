import { isBrowser } from "is-in-browser"
import { SnackbarProvider } from "notistack"
import React from "react"

import { Box } from "@mui/material"

import {
  BlocksGrid,
  CommonLayout,
  GameControlButton,
  PortraitWarningBackdrop,
  SnackbarPopper,
} from "../components"
import { PeriotrisViewModel, PeriotrisViewModelContext } from "../viewmodel"

import type { ICommonLayoutProps } from "../components"

const Hammer: HammerStatic = isBrowser ? require("hammerjs") : null

class App extends React.Component {
  private readonly _viewModel: PeriotrisViewModel = new PeriotrisViewModel()
  private readonly _rowTwoRef: React.RefObject<HTMLDivElement> =
    React.createRef<HTMLDivElement>()
  private _hammer!: HammerManager // FIXME: Borked

  static Layout: (
    props: ICommonLayoutProps
  ) => React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<unknown>
  >

  public constructor(props: Record<string, never>) {
    super(props)
  }

  public componentDidMount(): void {
    window.addEventListener(
      "keydown",
      this._viewModel.onKeyDown.bind(this._viewModel)
    )

    this._hammer = new Hammer(this._rowTwoRef.current as HTMLElement)
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
        <SnackbarProvider
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box
            sx={{
              /* display-related props */ display: "grid",
              gridTemplateRows: "1fr 80% 1fr",

              /* layouts: width, height, margin, padding, etc.*/
              position: "relative",
              height: "100%",
              minHeight: "0px",
              width: "100%",
              minWidth: "0px",
              boxSizing: "border-box",
              flex: "1 1 auto" /* For CommonLayout.tsx headers */,

              /* element-specific props */
              /* background-color to be filled */
            }}
          >
            <PortraitWarningBackdrop />
            <Box
              className="game-page__row-2"
              ref={this._rowTwoRef}
              sx={{
                gridRow: 2,
                position: "relative",
              }}
            >
              <BlocksGrid />
            </Box>
            <SnackbarPopper />
            <GameControlButton
              onClick={this._viewModel.invokeGameControl.bind(this._viewModel)}
            />
          </Box>
        </SnackbarProvider>
      </PeriotrisViewModelContext.Provider>
    )
  }
}

App.Layout = CommonLayout

export default App
