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
    const { row, play } = this.props;
    return (
      <tr>
        {/* ALL CELLS MAPPING TO GET THE CELL COMPONENT */}
        {row.map((cell, i) => (
          <Cell key={i} value={cell} columnIndex={i} play={play} />
        ))}
      </tr>
    );
  }
}

export default Row;
