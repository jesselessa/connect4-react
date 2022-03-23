// REACT
import React from "react";
// STYLES
import "./App.css";

export default class App extends React.Component {
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
  render() {
    return <div>App</div>;
  }
}
