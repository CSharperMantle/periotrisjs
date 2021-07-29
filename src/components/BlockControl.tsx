import "./BlockControl.css"
import React from "react"
import { IDisplayBlock } from "../viewmodel/IDisplayBlock"
import defaultPeriodicTable from "../json/DefaultPeriodicTable.json"
import defaultColorScheme from "../json/DefaultColorScheme.json"
import _ from "lodash"

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
          backgroundColor: getBackgroundColorByAtomicNumber(
            this.props.atomicNumber
          ),
        }}
      >
        <div
          className="block-control__symbol"
          style={{
            color: this.props.symbolColor,
          }}
        >
          {this.props.atomicNumber > 0
            ? defaultPeriodicTable.elements[this.props.atomicNumber - 1].symbol
            : -this.props.atomicNumber}
        </div>
      </div>
    )
  }
}

function getBackgroundColorByAtomicNumber(atomicNumber: number): string {
  for (let i = 0; i < defaultColorScheme.rules.length; i++) {
    const rule = defaultColorScheme.rules[i]
    if (
      _.inRange(
        atomicNumber,
        rule.atomicNumberRange.from,
        rule.atomicNumberRange.to + 1
      )
    ) {
      return rule.color
    }
  }
  throw new Error("atomicNumber")
}

export { BlockControl, getBackgroundColorByAtomicNumber }
