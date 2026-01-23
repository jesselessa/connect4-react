//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//                           APP.JSX                              //
//                  WELCOME TO CONNECT4 GAME                      //
//                       MAIN REACT PAGE                          //
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

// React
import React, { createRef } from "react";
// Styles
import "./App.css";
// Components
import Row from "./components/Row.jsx";
import Rules from "./components/Rules.jsx";
import Speaker from "./components/Speaker.jsx";
// Audio
import winner from "./assets/audio/winning.mp3";
import drawOrFailure from "./assets/audio/draw-or-failure.mp3";
import tokenSound from "./assets/audio/token.mp3";

class App extends React.Component {
  constructor() {
    super();
    // Initial state
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
      isSoundEnabled: true, // Enable/disable token sound
    };

    // Speaker reference
    this.speakerRef = createRef(); // Targets Speaker component => Allows App to access its methods like stopMusic()

    // Binding methods (attached to 'this' i.e. App component)
    this.play = this.play.bind(this);
    this.toggleSound = this.toggleSound.bind(this);
  }

  // Create an empty board (6x7)
  createEmptyBoard() {
    return Array(6).fill(null).map(() => Array(7).fill(null));
  }

  // Initialize game board and set starting player
  initBoard(playerStarting = null) {
    this.setState({
      board: this.createEmptyBoard(),
      currentPlayer: playerStarting,
      gameOver: false,
      message: playerStarting === null ? "Sélectionnez le premier joueur." : "",
      winningCombination: [],
      lastMove: null, // Reset last move
    });
  }

  // WHEN COMPONENT MOUNTS
  componentDidMount() {
    this.initBoard();
  }

  // AFTER EVERY UPDATE, CHECK WHOSE TURN TO PLAY
  componentDidUpdate(prevProps, prevState) {
    // If it's the CPU's turn AND the CPU mode is active AND the game is not over
    if (
      this.state.isVsCPU &&
      this.state.currentPlayer === this.state.player2 &&
      !this.state.gameOver
    ) {
      // Add a small delay to make it feel natural (1000ms = 1s)
      setTimeout(() => this.cpuPlay(), 1000);
    }
  }

  // Create CPU move (Smart AI logic)
  cpuPlay() {
    const { board, player1, player2 } = this.state;
    const availableColumns = [];

    // List all available columns
    for (let c = 0; c < 7; c++) {
      if (board[0][c] === null) {
        availableColumns.push(c);
      }
    }

    if (availableColumns.length > 0) {
      // --- STRATEGY 1: CAN THE AI WIN NOW ? ---
      for (let c of availableColumns) {
        if (this.checkWinningMove(board, c, player2)) {
          this.play(c);
          return; // Move made, exit function
        }
      }

      // --- STRATEGY 2: MUST THE AI BLOCK THE HUMAN ? ---
      for (let c of availableColumns) {
        if (this.checkWinningMove(board, c, player1)) {
          this.play(c);
          return; // Move made, exit function
        }
      }

      // --- STRATEGY 3: RANDOM MOVE (if no immediate win/threat) ---
      const randomColumn = availableColumns[Math.floor(Math.random() * availableColumns.length)];
      this.play(randomColumn);
    }
  }
  // Check if a specific player would win by playing in a given column
  checkWinningMove(board, column, player) {
    // Create a deep copy of the board to simulate the move safely 
    //! ⚠️ We don't want our AI to modify the actual game state during its reasoning
    const boardCopy = board.map(row => [...row]);

    // Simulate the token falling in the column
    for (let r = 5; r >= 0; r--) {
      if (!boardCopy[r][column]) {
        boardCopy[r][column] = player;
        break;
      }
    }

    // Capture the results of each check
    const vMove = this.checkVerticalMoves(boardCopy);
    const hMove = this.checkHorizontalMoves(boardCopy);
    const rdMove = this.checkRightDiagonalMoves(boardCopy);
    const ldMove = this.checkLeftDiagonalMoves(boardCopy);

    // We use checkAllMoves which already centralizes all checks
    const result = this.checkAllMoves(boardCopy);

    // Then, we check if the result is an object and if the winner is the correct player
    return result && typeof result === "object" && result.winner === player;
  }

  // Set change of player : if current player is player1, change to player2 and vice versa
  changePlayer() {
    return this.state.currentPlayer === this.state.player1
      ? this.state.player2
      : this.state.player1;
  }

  // Centralize end game, sounds and final message
  endGame(board, resultMessage, soundFile) {
    this.stopBackgroundMusic();
    // Play the correct sound based on the result message
    const soundToPlay = resultMessage.includes("perdu") ? drawOrFailure : soundFile;
    this.playSound(soundToPlay);
    this.setState({
      board,
      gameOver: true,
      message: resultMessage,
    });
  }

  // GAME LOGIC: Every time we click on a cell, function 'play' is called
  play(c) {
    // Note: c = column index & r = row index

    // 1. MODE SELECTOR: Check if a mode has been selected ; if not, display a message
    if (this.state.currentPlayer === null) {
      this.setState({ message: "Choisissez d'abord qui commence !" });
      return;
    }

    // 2. GAME IN PROGRESS: Proceed with the next move
    if (!this.state.gameOver) {
      let board = this.state.board;

      for (let r = 5; r >= 0; r--) {
        if (!board[r][c]) {
          board[r][c] = this.state.currentPlayer;

          // Jouer le son si activé
          if (this.state.isSoundEnabled) {
            const audio = new Audio(tokenSound);
            audio.play();
          }

          this.setState({ lastMove: { row: r, column: c } }); // Enregistrer la dernière position jouée
          break;
        }
      }

      // Check board status after the move
      let result = this.checkAllMoves(board);

      // Check if result exists AND if its winner corresponds to a player
      if (result && (result.winner === this.state.player1 || result.winner === this.state.player2)) {
        // Get winner for custom message
        const winnerPlayer = result.winner;
        const msg = `${winnerPlayer === this.state.player1 ? "Vous avez gagné" : "Vous avez perdu"} !!!`;

        // Store the winning combination coordinates in the state to highlight them later in Cell
        this.setState({ winningCombination: result.coords });

        // Terminate game with the winning message and sound
        this.endGame(board, msg, winner);
      } else if (result === "draw") {
        this.endGame(board, "Egalité.", drawOrFailure);
      } else {
        this.setState({ board, currentPlayer: this.changePlayer(), message: "" });
      }
    }

    // 3. GAME OVER: Prompt to reset the game
    else {
      this.stopBackgroundMusic();
      this.playSound(drawOrFailure);
      this.setState({
        message: "Cliquez sur 'Reset' pour commencer une nouvelle partie.",
      });
    }
  }

  // Stop background music via Speaker component
  stopBackgroundMusic() {
    if (this.speakerRef.current) {
      this.speakerRef.current.stopMusic();
    }
  }

  // Play sound effect
  playSound(audioFile) {
    const audio = new Audio(audioFile);
    audio.play();
  }

  // Check player moves
  checkVerticalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r - 1][c] &&
            board[r][c] === board[r - 2][c] &&
            board[r][c] === board[r - 3][c]
          )
            // Return player and the coordinates of the 4 tokens
            return {
              winner: board[r][c],
              coords: [[r, c], [r - 1, c], [r - 2, c], [r - 3, c]]
            };
        }
      }
    }
  }
  //? Explanation: The checkVerticalMoves function iterates through the game board starting from row index 3 to 5 (the bottom three rows) and checks each column for four consecutive identical non-null values (representing player moves). If such a sequence is found, it returns the value (player identifier) of the winning player.

  checkHorizontalMoves(board) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r][c + 1] &&
            board[r][c] === board[r][c + 2] &&
            board[r][c] === board[r][c + 3]
          ) {
            return {
              winner: board[r][c],
              coords: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]]
            };
          }
        }
      }
    }
  }
  //? Explanation: The checkHorizontalMoves function scans each row of the game board from row index 0 to 5 and checks for four consecutive identical non-null values in each row. It iterates through columns 0 to 3 (the first four columns) to ensure it can check the next three columns for a potential horizontal win. If it finds such a sequence, it returns the value (player identifier) of the winning player.

  checkRightDiagonalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r - 1][c + 1] &&
            board[r][c] === board[r - 2][c + 2] &&
            board[r][c] === board[r - 3][c + 3]
          ) {
            return {
              winner: board[r][c],
              coords: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]]
            };
          }
        }
      }
    }
  }
  //? Explanation: The checkRightDiagonalMoves function checks for diagonal wins that slope from the bottom-left to the top-right. It iterates through the board starting from row index 3 to 5 and column index 0 to 3, checking for four consecutive identical non-null values in a right diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

  checkLeftDiagonalMoves(board) {
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c]) {
          if (
            board[r][c] === board[r - 1][c - 1] &&
            board[r][c] === board[r - 2][c - 2] &&
            board[r][c] === board[r - 3][c - 3]
          ) {
            return {
              winner: board[r][c],
              coords: [[r, c], [r - 1, c - 1], [r - 2, c - 2], [r - 3, c - 3]]
            };
          }
        }
      }
    }
  }
  //? Explanation: The checkLeftDiagonalMoves function checks for diagonal wins that slope from the bottom-right to the top-left. It iterates through the board starting from row index 3 to 5 and column index 3 to 6, checking for four consecutive identical non-null values in a left diagonal direction. If such a sequence is found, it returns the value (player identifier) of the winning player.

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
  //? Explanation: The checkDraw function checks if the game board is completely filled without any empty cells (null values). It iterates through each cell of the board, and if it finds any empty cell, it returns null, indicating that the game is still ongoing. If no empty cells are found after checking the entire board, it returns "draw", indicating that the game has ended in a tie.

  checkAllMoves(board) {
    return (
      this.checkVerticalMoves(board) ||
      this.checkRightDiagonalMoves(board) ||
      this.checkLeftDiagonalMoves(board) ||
      this.checkHorizontalMoves(board) ||
      this.checkDraw(board)
    ) || null; // Return 'null' if no win or draw
  }
  //? Explanation: The checkAllMoves function consolidates the results of all individual move-checking functions (vertical, horizontal, right diagonal, left diagonal, and draw). It sequentially calls each of these functions and returns the result of the first one that indicates a win or a draw. If none of the functions find a winning condition or a draw, it returns undefined, indicating that the game is still in progress.

  toggleSound() {
    this.setState((prevState) => ({ isSoundEnabled: !prevState.isSoundEnabled }));
  }

  render() {
    const messageClass = this.state.gameOver ? "message animated-text" : "message";

    return (
      <div className="App">
        <Rules />

        <div className="titleAndBoard">
          {/* Pass the reference to Speaker */}
          <Speaker ref={this.speakerRef} />

          <div className="titleDiv">
            <h1>Puissance 4</h1>
          </div>

          <div className="boardAndButton">
            {/* 1. MODE SELECTOR: Only if no player is selected (game not started) */}
            {this.state.currentPlayer === null && (
              <div className="mode-selector">
                <button onClick={() => this.initBoard(1)}>Je commence</button>
                <button onClick={() => this.initBoard(2)}>L'IA commence</button>
              </div>
            )}

            {/* 2. MESSAGE */}
            <p className={messageClass}>{this.state.message}</p>

            {/* 3. BOARD */}
            <table>
              <tbody>
                {/* All rows mapping to get the Row component */}
                {this.state.board.map((row, i) => (
                  <Row
                    key={i}
                    row={row}
                    rowIndex={i}
                    play={this.play}
                    winningCombination={this.state.winningCombination}
                    lastMove={this.state.lastMove} // Pass last position played
                  />
                ))}
              </tbody>
            </table>

            {/* 4. RESET AND TOKEN SOUND BUTTON: Only if a player is selected (game in progress) */}
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
