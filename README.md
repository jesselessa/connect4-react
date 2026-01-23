# Connect4-React

This project is an implementation of the well-known 'Connect 4' game.

## Table of Contents

- [Demo](#demo)
- [Stack](#stack)
- [Screenshot](#screenshot)
- [Main features](#main-features)
- [Game rules](#game-rules)
- [Musical credits](#musical-credits)
- [Run the project locally](#run-the-project-locally)
- [Getting started with Vite](#getting-started-with-vite)
- [Contributing](#contributing)
- [Stay Updated](#stay-updated)
- [Contact](#contact)

## Demo

You can play the game [here](https://www.connect4.jesselessa.dev).

## Stack

This project has been created with React using Vite.

It uses Class components (before React 16.8, it was the only way to track state and lifecycle on a React component).

## Screenshot

![Screenshot](./public/screenshot.png)

## Main features

- **PvE Mode** : Play against an AI opponent with automated decision-making.
- **Dynamic Token Animation** : Realistic "drop" effect where tokens fall from the top of the grid to their position.
- **Visual Feedback** : The winning combination is highlighted with a pulse animation to clearly identify the end of the game.
- **Immersive Sound Effects** : Specific sounds for token drops, victory, defeat, and draw games.
- **Responsive Design** : The game board and UI adapt perfectly to mobile, tablet and desktop screens.
- **Game State Management** : Automatic detection of turns, victories, and stalemates with an easy reset option.
- **Background Music** : Integrated audio toggle for an enhanced gaming atmosphere.

## Game Rules

- **Choose the initial player** : Select the player starting the game.
- **Turn-based play** : Player 1 (Red tokens) always starts, followed by Player 2 the AI (Yellow tokens).
- **The Drop** : On your turn, click on a column to drop your colored token. It will fall to the lowest available space in that column.
- **Objective** : Be the first to line up four of your tokens horizontally, vertically, or diagonally.
- **Winning & Draw** :
  - If a player aligns four tokens, those tokens will pulse, and the winner sound will play.
  - If the grid is full with no winner, the game ends in a stalemate (draw).
- **Restarting** : Click the 'Reset' button at any time to clear the board. The starter of the previous game will go second in the next round.

## Musical credits

Licence: Pixabay Content License (Free Use)

- **Background Music** : ['80's Music - Electric Dreams 2.0' by Tech_Oasis](https://pixabay.com/fr/music/synthwave-80x27s-music-electric-dreams-20-211957/)
- **Token Drop Sound** : ['Coin Bag Pickup Drop' by ralph.whitehead](https://pixabay.com/fr/sound-effects/films-et-effets-sp%c3%a9ciaux-coin-bag-pickup-drop-94617/)
- **Victory Sound** : ['Winning' by PW23CHECK](https://pixabay.com/fr/sound-effects/winning-218995/)
- **Game Over / Defeat Sound** : ['Failure 1' by Leszek_Szary](https://pixabay.com/fr/sound-effects/failure-1-89170/)
- **Stalemate Sound** : ['Short Mission Accomplished' (Pixabay)](https://pixabay.com/fr/sound-effects/)

## Run the project locally

1. Open your terminal and navigate to the location where you want the local repository to be copied.
2. Clone the repository : `git clone https://github.com/jesselessa/connect4-react.git`
3. Navigate to the project directory : `cd connect4-react`
4. Install dependencies required in the project : `npm install`
5. Run the application in development mode : `npm run dev`
6. Open http://localhost:5173 in your preferred browser to view the development server.

## Getting Started with Vite

[Vite](https://vitejs.dev/) is a fast development tool for modern web applications. To get started with Vite, follow these simple steps :

### 1. Install Node.js and npm

Ensure you have Node.js and npm installed on your system. You can download and install them from the [official Node.js website](https://nodejs.org/en).

### 2. Initialize the project

If you have not already created a project, you can initialize a new project using the following command in your terminal : `npm init vite@latest my-project --template react`.

This command will create a new directory named `my-project` and install a Vite project with a React template in it.

### 3. Install dependencies

Once the project is initialized, navigate to the newly created directory (`cd my-project`) and install the dependencies by running the command `npm install`.

### 4. Start the development server

To start the development server, use the command `npm run dev`.

This will launch Vite and automatically open your default browser to http://localhost:5173, where you can see your live application.

### 5. Deploy to production

To build an optimized version of your application ready for production, use the command `npm run build`.

This will generate a production-ready version of your application in the `dist` directory of your project.

## Contributing

- If you are interested in contributing, explore the project structure in the 'src' folder and modules installed in the 'package.json' file.
- Feel free to make improvements, fix bugs, or suggest new features.

## Stay updated

To stay updated with the project latest changes, you can pull them from the repository : `git pull origin main`

## Contact

For inquiries, contact me via [LinkedIn](https://www.linkedin.com/in/jesselessa/).

---

&copy; 2024, Jessica ELESSA - All rights reserved
