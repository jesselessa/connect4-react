//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                            CELL.JSX                            //
//                        LINKED TO ROW.JSX                       //
//          DEFINES PLAYER'S CELL COLOR & MAKE IT CLICKABLE       //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// React
import React from "react";

class Cell extends React.Component {
  render() {
    const { value, columnIndex, rowIndex, play, winningCombination } = this.props;

    // 1. Change cell color based on player value
    let color = "white"; // Default empty cell
    if (value === 1) {
      color = "red"; // Player 1 (Human)
    } else if (value === 2) {
      color = "yellow"; // Player 2 (AI)
    }

    // 2. Check if this cell is part of the winning combination
    // .some() returns 'true' if a pair [r, c] matches [rowIndex, columnIndex]
    const isWinningCell = winningCombination.some(
      (coord) => coord[0] === rowIndex && coord[1] === columnIndex
    );

    return (
      <td>
        {/* Clickable cell */}
        <div
          className="cell"
          onClick={() => {
            play(columnIndex);
          }}
        >
          {/* Si isWinningCell est vrai, on ajoute la classe 'orange', sinon rien */}
          <div className={`${color} ${isWinningCell ? "orange" : ""}`}></div>
        </div>
      </td>
    );
  }
}

export default Cell;
