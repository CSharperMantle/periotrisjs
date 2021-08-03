import { observer } from "mobx-react"
import React from "react"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import {
  PeriotrisViewModel,
  PeriotrisViewModelContext,
} from "../viewmodel/PeriotrisViewModel"
import { BlockControl } from "./BlockControl"
import "./BlocksGrid.css"

const BlocksGrid = observer(
  class BlocksGrid extends React.Component {
    static contextType = PeriotrisViewModelContext
    declare context: React.ContextType<typeof PeriotrisViewModelContext>

    public render() {
      const viewModel: PeriotrisViewModel = this.context

      const blocks = viewModel.sprites.map(
        (block: IDisplayBlock, index: number) => {
          return (
            <BlockControl
              key={index}
              atomicNumber={block.atomicNumber}
              row={block.row}
              column={block.column}
              symbolColor={block.symbolColor}
            />
          )
        }
      )
      return <div className="play-area__canvas-grid">{blocks}</div>
    }
  }
)

export { BlocksGrid }
