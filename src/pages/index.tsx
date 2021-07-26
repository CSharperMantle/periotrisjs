import React from "react"
import { Stack, Text, Link, FontWeights, DefaultButton } from "@fluentui/react"
import "./index.css"
import { BlockControl } from "../components/BlockControl"

interface IAppProps {}

interface IAppState {}

class App extends React.Component<IAppProps, IAppState> {
  public constructor(props: IAppProps) {
    super(props)
  }

  public render() {
    return (
      <main className="game-page">
        <div className="play-area">
          <div className="play-area__canvas-grid">
            <BlockControl
              symbol="El"
              row={1}
              column={1}
              backgroundColor="white"
              symbolColor="black"
            />
          </div>
        </div>
      </main>
    )
  }
}

export default App
