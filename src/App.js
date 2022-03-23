// REACT
import React from "react";
// STYLES
import "./App.css";

class App extends React.Component {
  // State
  constructor() {
    super();

    this.state = {
      player1: 1,
      player2: 2,
      currentPlayer: null,
      board: [],
      gameOver: false,
      message: "",
    };
  }

  // INITIATE NEW GAME
  initBoard() {
    // CREATE A BLANK 6x7 BOARD
    const board = [];
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 7; c++) {
        row.push(null);
      }
      board.push(row);
    }

    // STATE MODIFICATION
    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      message: "",
    });

    // CONSOLE EMPTY BOARD FILLED WITH NULL - NO PLAYER MOVES
    console.log(board);
  }

  // CURRENT PLAYER -> NEXT PLAYER
  changePlayer() {
    return this.state.currentPlayer === this.state.player1
      ? this.state.player2
      : this.state.player1;
  }

  checkVerticalMoves(board) {
    // CHECK ONLY IF ROW IS 3 OR GREATER
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          // CHECK IF OUR TOKENS ARE ALL IN THE SAME COLUMN
          if (
            board[r][c] === board[r - 1][c] &&
            board[r][c] === board[r - 2][c] &&
            board[r][c] === board[r - 3][c]
          ) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkHorizontalMoves(board) {
    // CHECK ONLY IF COLUMN IS 3 OR LESS
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r][c + 1] &&
            board[r][c] === board[r][c + 2] &&
            board[r][c] === board[r][c + 3]
          ) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkRightDiagonalMoves(board) {
    // CHECK ONLY IF ROW IS 3 OR GREATER && COLUMN IS 3 OR LESS
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r - 1][c + 1] &&
            board[r][c] === board[r - 2][c + 2] &&
            board[r][c] === board[r - 3][c + 3]
          ) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkLeftDiagonalMoves(board) {
    // CHECK ONLY IF ROW IS 3 OR GREATER && COLUMN IS 3 OR GREATER
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r - 1][c - 1] &&
            board[r][c] === board[r - 2][c - 2] &&
            board[r][c] === board[r - 3][c - 3]
          ) {
            return board[r][c];
          }
        }
      }
    }
  }

  checkDraw(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) {
          return null;
        }
      }
    }
    return "draw";
  }

  checkAllMoves(board) {
    return (
      this.checkVerticalMoves(board) ||
      this.checkRightDiagonalMoves(board) ||
      this.checkLeftDiagonalMoves(board) ||
      this.checkHorizontalMoves(board) ||
      this.checkDraw(board)
    );
  }

  render() {
    return <div>App</div>;
  }
}

export default App;
