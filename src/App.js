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

  render() {
    return <div>App</div>;
  }
}

export default App;
