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
    let color = "white"; // Empty cell by default
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

    const dropClass = value ? "drop" : ""; // If player has placed a token, add 'drop' class for animation

    return (
      <td>
        <div
          className="cell" // Clickable cell to activate 'play' function
          onClick={() => {
            play(columnIndex);
          }}
        >
          {/* Permanent empty cell */}
          <div className="white"></div>

          {/* Token with animation */}
          <div className={`${color} ${dropClass} ${isWinningCell ? "orange" : ""}`}></div>
        </div>
      </td>
    );
  }
}

export default Cell;
