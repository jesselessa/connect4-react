//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                            ROW.JSX                             //
//                        LINKED TO APP.JSX                       //
//                  DEFINES CELLS FOR EVERY ROWS                  //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// React
import React from "react";
// Component
import Cell from "./Cell.jsx";

class Row extends React.Component {
  render() {
    const { row, play, rowIndex, winningCombination } = this.props;
    return (
      <tr>
        {/* All cells mapping to get the Cell component */}
        {row.map((cell, i) => (
          <Cell
            key={i}
            value={cell}
            columnIndex={i}
            rowIndex={rowIndex}
            play={play}
            winningCombination={winningCombination}
          />
        ))}
      </tr>
    );
  }
}

export default Row;
