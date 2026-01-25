//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                          APP.JSX                               //
//                  WELCOME TO CONNECT4 GAME                      //
//                       MAIN REACT PAGE                          //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

import React, { createRef } from "react";
import "./App.css";
import Row from "./components/Row.jsx";
import Rules from "./components/Rules.jsx";
import Speaker from "./components/Speaker.jsx";

// Audio files
import winner from "./assets/audio/winning.mp3";
import drawOrFailure from "./assets/audio/draw-or-failure.mp3";
import tokenSound from "./assets/audio/token.mp3";

class App extends React.Component {
  constructor() {
    super();
    // 1. Initial State Definition
    this.state = {
      board: [],
      player1: 1, // Human
      player2: 2, // Computer (AI)
      currentPlayer: null,
      gameOver: false,
      message: "",
      isVsCPU: true, // Computer mode by default 
      winningCombination: [], // Coordinates of winning tokens
      lastMove: null, // Last played position for animation
      isSoundEnabled: true, // Token sound enabled by default
    };

    // 2. References & Method Binding
    this.speakerRef = createRef();
    this.play = this.play.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                      LIFECYCLE METHODS                         //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Initialize the board when the app loads
  componentDidMount() {
    this.initBoard();
  }

  // Monitor state changes to trigger AI moves
  componentDidUpdate(prevProps, prevState) {
    // If the CPU mode is active AND it's the CPU's turn AND the game is not over
    if (
      this.state.isVsCPU &&
      this.state.currentPlayer === this.state.player2 &&
      !this.state.gameOver
    ) {
      // Small delay for UX to simulate "thinking"
      setTimeout(() => this.cpuPlay(), 1000);
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                        BOARD LOGIC                             //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Generate an initial 6x7 grid filled with null values
  createEmptyBoard() {
    return Array(6).fill(null).map(() => Array(7).fill(null));
  }

  // Reset or start a new game session
  initBoard(playerStarting = null) {
    this.setState({
      board: this.createEmptyBoard(),
      currentPlayer: playerStarting,
      gameOver: false,
      message: playerStarting === null ? "Sélectionnez le premier joueur." : "",
      winningCombination: [],
      lastMove: null,
    });
  }

  // Swap active player between 1 and 2
  changePlayer() {
    return this.state.currentPlayer === this.state.player1
      ? this.state.player2
      : this.state.player1;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                        CORE GAMEPLAY                           //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // Main interaction function called when a cell/column is clicked
  // Note: In the parameters, 'c' stands for column index & 'r' for row index
  play(c) {
    // 1. Prevent move if no mode/player is selected
    if (this.state.currentPlayer === null) {
      this.setState({ message: "Choisissez d'abord qui commence !" });
      return;
    }

    // 2. Game in progress
    if (!this.state.gameOver) {
      let board = this.state.board;

      // Find the lowest available row in the selected column
      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.currentPlayer;

          // Sound effect logic
          if (this.state.isSoundEnabled) {
            const audio = new Audio(tokenSound);
            audio.play();
          }

          this.setState({ lastMove: { row: r, column: c } });
          break;
        }
      }

      // Evaluate board status after the token is placed
      let result = this.checkAllMoves(board);

      if (result && (result.winner === this.state.player1 || result.winner === this.state.player2)) {
        const winnerPlayer = result.winner;
        const msg = `${winnerPlayer === this.state.player1 ? "Vous avez gagné" : "Vous avez perdu"} !!!`;

        this.setState({ winningCombination: result.coords });
        this.endGame(board, msg, winner);

      } else if (result === "draw") {
        this.endGame(board, "Egalité.", drawOrFailure);
      } else {
        // Continue game: update board and switch turn
        this.setState({ board, currentPlayer: this.changePlayer(), message: "" });
      }
    }

    // 3. Game over
    else {
      // Handle click when game is already finished
      this.stopBackgroundMusic();
      this.playSound(drawOrFailure);
      this.setState({ message: "Cliquez sur 'Reset' pour commencer une nouvelle partie." });
    }
  }

  // Centralize the end-of-game sequence
  endGame(board, resultMessage, soundFile) {
    this.stopBackgroundMusic();
    const soundToPlay = resultMessage.includes("perdu") ? drawOrFailure : soundFile;
    this.playSound(soundToPlay);
    this.setState({
      board,
      gameOver: true,
      message: resultMessage,
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                      AI & SIMULATION                           //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  // CPU decision-making algorithm
  cpuPlay() {
    const { board, player1, player2 } = this.state;
    const availableColumns = [];

    // Identify columns that are not full
    for (let c = 0; c < 7; c++) {
      if (board[0][c] === null) {
        availableColumns.push(c);
      }
    }

    if (availableColumns.length > 0) {
      // PRIORITY 1: Can the CPU win in this move ?
      for (let c of availableColumns) {
        if (this.checkWinningMove(board, c, player2)) {
          this.play(c);
          return;
        }
      }

      // PRIORITY 2: Does the Human have a winning move to block ?
      for (let c of availableColumns) {
        if (this.checkWinningMove(board, c, player1)) {
          this.play(c);
          return;
        }
      }

      // PRIORITY 3: Fallback to random move
      const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      this.play(randomColumn);
    }
  }
  // ? Explanation: The cpuPlay function implements a simple AI for the computer player. It first identifies all columns that are not full and can accept a new token. The AI then checks if it can win in the current move by simulating a move in each available column using the checkWinningMove function. If a winning move is found, it plays that move. If not, it checks if the human player has a potential winning move in the next turn and blocks it if necessary. If neither condition is met, the AI selects a random available column to play its token.

  // Simulates a move on a virtual board to check for potential win
  checkWinningMove(board, column, player) {
    // Create a deep copy to avoid mutating the real state
    const boardCopy = board.map(row => [...row]);

    for (let r = 5; r >= 0; r--) {
      if (!boardCopy[r][column]) {
        boardCopy[r][column] = player;
        break;
      }
    }

    const result = this.checkAllMoves(boardCopy);
    return result && typeof result === "object" && result.winner === player;
  }
  // ? Explanation: The checkWinningMove function simulates placing a token for the specified player in the given column on a copy of the current board. It then checks if this move results in a win for that player by calling the checkAllMoves function. If it does, the function returns true, indicating that placing a token in that column would lead to a victory.

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                    WIN/DRAW CHECK ALGORITHMS                   //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  checkVerticalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] &&
          board[r][c] === board[r - 1][c] &&
          board[r][c] === board[r - 2][c] &&
          board[r][c] === board[r - 3][c]) {
          return { winner: board[r][c], coords: [[r, c], [r - 1, c], [r - 2, c], [r - 3, c]] };
        }
      }
    }
  }
  //? Explanation: The checkVerticalMoves function iterates through the game board starting from row index 3 to 5 (the bottom three rows) and checks each column for four consecutive identical non-null values (representing player moves). If such a sequence is found, it returns the value (player identifier) of the winning player.

  checkHorizontalMoves(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] &&
          board[r][c] === board[r][c + 1] &&
          board[r][c] === board[r][c + 2] &&
          board[r][c] === board[r][c + 3]) {
          return { winner: board[r][c], coords: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
        }
      }
    }
  }
  //? Explanation: The checkHorizontalMoves function scans each row of the game board from row index 0 to 5 and checks for four consecutive identical non-null values in each row. It iterates through columns 0 to 3 (the first four columns) to ensure it can check the next three columns for a potential horizontal win. If it finds such a sequence, it returns the value (player identifier) of the winning player.

  checkRightDiagonalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] &&
          board[r][c] === board[r - 1][c + 1] &&
          board[r][c] === board[r - 2][c + 2] &&
          board[r][c] === board[r - 3][c + 3]) {
          return { winner: board[r][c], coords: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
        }
      }
    }
  }
  //? Explanation: The checkRightDiagonalMoves function checks for diagonal wins that slope from the bottom-left to the top-right. It iterates through the board starting from row index 3 to 5 and column index 0 to 3, checking for four consecutive identical non-null values in a right diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

  checkLeftDiagonalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c] &&
          board[r][c] === board[r - 1][c - 1] &&
          board[r][c] === board[r - 2][c - 2] &&
          board[r][c] === board[r - 3][c - 3]) {
          return { winner: board[r][c], coords: [[r, c], [r - 1, c - 1], [r - 2, c - 2], [r - 3, c - 3]] };
        }
      }
    }
  }
  //? Explanation: The checkLeftDiagonalMoves function checks for diagonal wins that slope from the bottom-right to the top-left. It iterates through the board starting from row index 3 to 5 and column index 3 to 6, checking for four consecutive identical non-null values in a left diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

  checkDraw(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) return null;
      }
    }
    return "draw";
  }
  //? Explanation: The checkDraw function checks if the game board is completely filled without any empty cells (null values). It iterates through each cell of the board, and if it finds any empty cell, it returns null, indicating that the game is still ongoing. If no empty cells are found after checking the entire board, it returns "draw", indicating that the game has ended in a tie.

  // Combines all checks into a single result
  checkAllMoves(board) {
    return (
      this.checkVerticalMoves(board) ||
      this.checkRightDiagonalMoves(board) ||
      this.checkLeftDiagonalMoves(board) ||
      this.checkHorizontalMoves(board) ||
      this.checkDraw(board)
    ) || null;
  }
  //? Explanation: The checkAllMoves function consolidates the results of all individual move-checking functions (vertical, horizontal, right diagonal, left diagonal, and draw). It sequentially calls each of these functions and returns the result of the first one that indicates a win or a draw. If none of the functions find a winning condition or a draw, it returns undefined, indicating that the game is still in progress.

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                        AUDIO HELPERS                           //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  stopBackgroundMusic() {
    if (this.speakerRef.current) {
      this.speakerRef.current.stopMusic();
    }
  }

  playSound(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
  }

  toggleSound() {
    this.setState((prevState) => ({ isSoundEnabled: !prevState.isSoundEnabled }));
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  //                            RENDER                              //
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  render() {
    const messageClass = this.state.gameOver ? "message animated-text" : "message";

    return (
      <div className="App">
        <Rules />

        <div className="titleAndBoard" id="titleAndBoard">
          <Speaker ref={this.speakerRef} />

          <div className="titleDiv">
            <h1>Puissance 4</h1>
          </div>

          <div className="boardAndButton">
            {/* Start Screen: Selection of first player */}
            {this.state.currentPlayer === null && (
              <div className="mode-selector">
                <button onClick={() => this.initBoard(1)}>Je commence</button>
                <button onClick={() => this.initBoard(2)}>L'IA commence</button>
              </div>
            )}

            <p className={messageClass}>{this.state.message}</p>

            <table>
              <tbody>
                {this.state.board.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    rowIndex={i}
                    play={this.play}
                    winningCombination={this.state.winningCombination}
                    lastMove={this.state.lastMove}
                  />
                ))}
              </tbody>
            </table>

            {/* Game Controls: Visible after start */}
            {this.state.currentPlayer !== null && (
              <div className="btn-group">
                <button className="reset-btn" onClick={() => this.initBoard()}>
                  RESET
                </button>

                <button className="token-sound-btn" onClick={this.toggleSound}>
                  {this.state.isSoundEnabled ? "Désactiver le son des jetons" : "Activer le son des jetons"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;