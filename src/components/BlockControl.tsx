import "./BlockControl.css"
import React from "react"

interface IBlockControlProps {
  symbol: string
  column: number
  row: number
  backgroundColor: string
  symbolColor: string
}

interface IBlockControlState {}

class BlockControl extends React.Component<
  IBlockControlProps,
  IBlockControlState
> {
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
          {this.props.symbol}
        </div>
      </div>
    )
  }
}

export { BlockControl }
