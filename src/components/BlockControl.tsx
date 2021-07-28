import "./BlockControl.css"
import React from "react"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"

interface IBlockControlProps extends IDisplayBlock {
  key: number
}

class BlockControl extends React.Component<IBlockControlProps> {
  public constructor(props: IBlockControlProps) {
    super(props)
  }

  public render() {
    return (
      <div
        className="block-control"
        style={{
          /*
           * Add one to grid-row and grid-column because CSS
           * properties of grid start from 1.
           */
          gridRow: this.props.row + 1,
          gridColumn: this.props.column + 1,
          backgroundColor: this.props.backgroundColor,
        }}
      >
        <div
          className="block-control__symbol"
          style={{
            color: this.props.symbolColor,
          }}
        >
          {this.props.atomicNumber}
        </div>
      </div>
    )
  }
}

export { BlockControl }
