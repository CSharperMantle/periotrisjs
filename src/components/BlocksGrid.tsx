import { observer } from "mobx-react"
import React from "react"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import { BlockControl } from "./BlockControl"
import "./BlocksGrid.css"

interface IBlocksGridProps {
  blocksList: IDisplayBlock[]
}

const BlocksGrid = observer(
  class BlocksGrid extends React.Component<IBlocksGridProps> {
    public constructor(props: IBlocksGridProps) {
      super(props)
    }

    public render() {
      const blocks = this.props.blocksList.map(
        (block: IDisplayBlock, index: number) => {
          return (
            <BlockControl
              key={index}
              atomicNumber={block.atomicNumber}
              row={block.row}
              column={block.column}
              symbolColor={block.symbolColor}
              backgroundColor={block.backgroundColor}
            />
          )
        }
      )
      return <div className="play-area__canvas-grid">{blocks}</div>
    }
  }
)

export { BlocksGrid }
