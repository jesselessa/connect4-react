//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                            CELL.JSX                            //
//                        LINKED TO ROW.JSX                       //
//          DEFINES PLAYER'S CELL COLOR & MAKE IT CLICKABLE       //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// React
import React from "react";

class Cell extends React.Component {
  render() {
    const { value, columnIndex, play } = this.props;

    // Change cell color based on player value
    let color = "white"; // Default empty cell
    if (value === 1) {
      color = "red"; // Player 1 (Human)
    } else if (value === 2) {
      color = "yellow"; // Player 2 (AI)
    }

    return (
      <td>
        {/* Clickable cell */}
        <div
          className="cell"
          onClick={() => {
            play(columnIndex);
          }}
        >
          <div className={color}></div>
        </div>
      </td>
    );
  }
}

export default Cell;
