//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                           APP.JS                               //
//                  WELCOME TO CONNECT4 GAME                      //
//                       MAIN REACT PAGE                          //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// REACT
import React, { createRef } from "react";
// STYLES
import "./App.css";
// COMPONENTS
import Row from "./components/Row.jsx";
import Rules from "./components/Rules.jsx";
import Speaker from "./components/Speaker.jsx";
// AUDIO
import winner from "./assets/audio/winning.mp3";
import drawOrFailure from "./assets/audio/draw-or-failure.mp3";

class App extends React.Component {
  constructor() {
    super();
    // STATE
    this.state = {
      player1: 1,
      player2: 2,
      currentPlayer: null,
      board: [],
      gameOver: false,
      message: "",
    };

    // SPEAKER REFERENCE
    this.speakerRef = createRef();

    // BINDS
    this.play = this.play.bind(this);
  }

  // INITIATE NEW GAME
  initBoard() {
    // CREATE A BLANK 6x7 BOARD
    const board = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));
    // console.log(board);

    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      message: "",
    });
  }

  // CURRENT PLAYER -> NEXT PLAYER
  changePlayer() {
    return this.state.currentPlayer === this.state.player1
      ? this.state.player2
      : this.state.player1;
  }

  // EVERY TIME YOU CLICK ON A CELL, FUNCTION PLAY IS CALLED
  play(c) {
    // c = column index & r = row index
    // CHECK IF GAME IS OVER OR NOT
    if (!this.state.gameOver) {
      let board = this.state.board;

      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.currentPlayer;
          break;
        }
      }

      // CHECK BOARD STATUS
      let result = this.checkAllMoves(board);

      if (result === this.state.player1 || result === this.state.player2) {
        this.stopBackgroundMusic();
        this.playSound(winner);
        this.setState({
          board,
          gameOver: true,
          message: `Player ${result} wins !!!`,
        });
      } else if (result === "draw") {
        this.stopBackgroundMusic();
        this.playSound(drawOrFailure);
        this.setState({ board, gameOver: true, message: "Draw game." });
      } else {
        this.setState({ board, currentPlayer: this.changePlayer() });
      }
    } else {
      this.stopBackgroundMusic();
      this.playSound(drawOrFailure);
      this.setState({
        message: "Click on reset button to start a new game.",
      });
    }
  }

  // STOP BACKGROUND MUSIC VIA SPEAKER COMPONENT
  stopBackgroundMusic() {
    if (this.speakerRef.current) {
      this.speakerRef.current.stopMusic();
    }
  }

  // PLAY SOUND EFFECTS
  playSound(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
  }

  // CHECK PLAYER MOVES
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

  // INITIATE BOARD WHEN FIRST APPEARS ON SCREEN
  componentDidMount() {
    this.initBoard();
  }

  render() {
    return (
      // MAIN BLOCK
      <div className="App">
        <Rules />

        <div className="titleAndBoard">
          {/* Pass the reference to Speaker */}
          <Speaker ref={this.speakerRef} />

          <div className="titleDiv">
            <h1>Puissance 4</h1>
          </div>

          <div className="boardAndButton">
            {/* MESSAGE */}
            <p className="message">{this.state.message}</p>
            {/* BOARD */}
            <table>
              <tbody>
                {/* ALL ROWS MAPPING TO GET THE ROW COMPONENT */}
                {this.state.board.map((row, i) => (
                  <Row key={i} row={row} play={this.play} />
                ))}
              </tbody>
            </table>
            {/* RESET BUTTON */}
            <div
              className="button"
              onClick={() => {
                this.initBoard();
              }}
            >
              RESET
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
