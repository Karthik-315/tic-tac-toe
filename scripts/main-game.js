"use strict";

/* Variables */
const playerOne = document.querySelector(".player-one");
const versusContainer = document.querySelector(".versus");
const playerTwo = document.querySelector(".player-two");
const winnerTextContainer = document.querySelector(".player-winner");
const winnerText = document.querySelector(".score-text");

const playerOneName = document.querySelector(".player-one--name");
const playerOneSymbol = document.querySelector(".player-one--symbol");
const playerTwoName = document.querySelector(".player-two--name");
const playerTwoSymbol = document.querySelector(".player-two--symbol");

const mainPlayArea = document.querySelector(".main__play-area");
const allSquares = document.querySelectorAll(".square");

const reloadButton = document.querySelector(".play-again-button");
const reloadButtonText = document.querySelector(".play-again--text");

let playerData;
let activePlayer = "x";
const winningPossibilities = [
    ["square-00", "square-01", "square-02"],
    ["square-10", "square-11", "square-12"],
    ["square-20", "square-21", "square-22"],
    ["square-00", "square-10", "square-20"],
    ["square-01", "square-11", "square-21"],
    ["square-02", "square-12", "square-22"],
    ["square-00", "square-11", "square-22"],
    ["square-02", "square-11", "square-20"],
];

let StateX = [];
let StateO = [];

/* Functions */
const initialize = function () {
    // Set player data to UI
    playerData = JSON.parse(window.localStorage.getItem("playerData"));

    [
        playerOneName.innerHTML,
        playerTwoName.innerHTML,
        playerOneSymbol.innerHTML,
        playerTwoSymbol.innerHTML,
    ] = Object.values(playerData);

    // Player that chose 'X', starts the game by default
    playerData.playerOneSymbol === "x"
        ? playerOne.classList.add("player-turn")
        : playerTwo.classList.add("player-turn");

    reloadButtonText.innerHTML = "Reload";
};

const endGame = function (winnerSymbol, winningGrid, isDraw) {
    mainPlayArea.classList.add("game-over");

    // Style squares based on the result.
    if (isDraw) {
        Array.from(allSquares).forEach((square) => {
            square.classList.add("game-over");
        });
        winnerText.innerHTML = `TIE!`;
    } else {
        const winner =
            winnerSymbol === playerData.playerOneSymbol
                ? playerData.playerOne
                : playerData.playerTwo;

        Array.from(allSquares).forEach((square) => {
            winningGrid.includes(square.classList[1])
                ? square.classList.add("winner")
                : square.classList.add("game-over");
        });

        winnerText.innerHTML = `${winner} Wins!`;
    }

    // Display the winner
    playerOne.classList.add("set-zero-opacity");
    versusContainer.classList.add("set-zero-opacity");
    playerTwo.classList.add("set-zero-opacity");
    winnerTextContainer.classList.remove("set-zero-opacity");

    reloadButtonText.innerHTML = "Play Again";

    return;
};

const compute = function () {
    const playAreaNodes = Array.from(mainPlayArea.children);
    let currentStateX = [];
    let currentStateO = [];
    let isXWinner,
        isOWinner = false;

    // Record the position of each player.
    playAreaNodes.forEach((node) => {
        if (!node.dataset.symbol) return;

        if (node.dataset.symbol === "x") {
            currentStateX.push(node.classList[1]);
        } else {
            currentStateO.push(node.classList[1]);
        }
    });

    // Compute if a player has won only if more than 3 symbols of the same type have been placed.
    if (currentStateX.length < 3 && currentStateO.length < 3) return;

    if (currentStateX.length >= 3) StateX.push(currentStateX);

    if (currentStateO.length >= 3) StateO.push(currentStateO);

    for (let possibility of winningPossibilities) {
        isXWinner = possibility.every((elem) => currentStateX.includes(elem));
        isOWinner = possibility.every((elem) => currentStateO.includes(elem));

        if (isXWinner) {
            endGame("x", possibility, false);
            break;
        } else if (isOWinner) {
            endGame("o", possibility, false);
            break;
        }
    }

    // Check for tie if all the squares are filled.
    let isMatchDraw =
        Array.from(mainPlayArea.children).every((elem) =>
            elem.classList.contains("active")
        ) && !(isXWinner || isOWinner);

    if (isMatchDraw) {
        endGame("", null, isMatchDraw);
        return;
    }
};

const placeSymbol = function (e) {
    const clickedElement = e.target;

    // Ignore clicks other than the squares
    if (!clickedElement.classList.contains("square")) return;

    // Place the corresponding symbol on the square and compute result.
    const symbolHTML = `
        <span class="square-text square-${activePlayer}">${activePlayer}</span>
    `;

    clickedElement.innerHTML = symbolHTML;
    clickedElement.dataset.symbol = activePlayer;
    clickedElement.classList.add("active");

    compute();

    // Switch players
    if (activePlayer === playerData.playerOneSymbol) {
        activePlayer = playerData.playerTwoSymbol;
        playerOne.classList.remove("player-turn");
        playerTwo.classList.add("player-turn");
    } else {
        activePlayer = playerData.playerOneSymbol;
        playerTwo.classList.remove("player-turn");
        playerOne.classList.add("player-turn");
    }
};

// Reloads the game.
const reloadGame = function () {
    window.location.href = "../index.html";
};

// Game starts here.
initialize();

/* Event Listeners */
mainPlayArea.addEventListener("click", placeSymbol);
reloadButton.addEventListener("click", reloadGame);
