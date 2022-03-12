"use strict";

/* Variables */
const homeButton = document.querySelector(".header__home-button");

const playerForm = document.querySelector(".player__form");
const allFormInput = document.querySelectorAll(".player__form input");

const playerOneSymbolContainer = document.querySelector(".player-one--selection");
const playerTwoSymbolContainer = document.querySelector(".player-two--selection");

let playerData = {};
let playerSymbolData = {};

const bgOverlay = document.querySelector(".main__overlay");
const errorModal = document.querySelector(".main__modal");
const closeModalButton = document.querySelector(".modal__close");

/* Functions */
const openModal = function (modal) {
    bgOverlay.classList.remove("hidden");
    errorModal.classList.remove("hidden");
};

const closeModal = function () {
    bgOverlay.classList.add("hidden");
    errorModal.classList.add("hidden");
};

const getUserData = function (e) {
    e.preventDefault();

    // Loop through user input.
    const userData = Array.from(allFormInput).reduce(
        (acc, input) => ({
            ...acc,
            [input.id]: input.value,
        }),
        {}
    );

    const isSymbolActive = Array.from(playerOneSymbolContainer.children)
        .filter((element) => element.classList.contains("active-symbol"))
        .some(() => true);

    if (!isSymbolActive) {
        openModal("error");
        return;
    }

    playerData = { ...userData, ...playerSymbolData };

    window.localStorage.setItem("playerData", JSON.stringify(playerData));
    window.location.href = "./html/main-game.html";
};

const setPlayerSymbol = function (e) {
    const clickedSymbol = e.target;
    playerSymbolData = {};

    if (
        !(
            clickedSymbol.classList.contains("selection--x") ||
            clickedSymbol.classList.contains("selection--o")
        )
    ) {
        return;
    }

    // Remove active class (highlight), if already present and add the active class to the clicked symbol.
    Array.from(playerOneSymbolContainer.children).map((element) =>
        element.classList.remove("active-symbol")
    );

    Array.from(playerTwoSymbolContainer.children).map((element) =>
        element.classList.remove("active-symbol")
    );

    // Set the clicked symbol as active symbol
    clickedSymbol.classList.add("active-symbol");

    if (`${clickedSymbol.classList}`.includes("one")) {
        if (`${clickedSymbol.classList}`.includes("x")) {
            document.querySelector(".player-two--o").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "x";
            playerSymbolData.playerTwoSymbol = "o";
        } else {
            document.querySelector(".player-two--x").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "o";
            playerSymbolData.playerTwoSymbol = "x";
        }
    }

    if (`${clickedSymbol.classList}`.includes("two")) {
        if (`${clickedSymbol.classList}`.includes("x")) {
            document.querySelector(".player-one--o").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "o";
            playerSymbolData.playerTwoSymbol = "x";
        } else {
            document.querySelector(".player-one--x").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "x";
            playerSymbolData.playerTwoSymbol = "o";
        }
    }
};

const initialize = function () {
    const playerDataLocal = JSON.parse(window.localStorage.getItem("playerData"));

    if (playerDataLocal) {
        const playerDataValues = Object.values(playerDataLocal);

        Array.from(allFormInput).map((input, index) => {
            input.value = playerDataValues[index];
        });

        if (playerDataValues[2] === "x") {
            document.querySelector(".player-one--x").classList.add("active-symbol");
            document.querySelector(".player-two--o").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "x";
            playerSymbolData.playerTwoSymbol = "o";
        } else {
            document.querySelector(".player-one--o").classList.add("active-symbol");
            document.querySelector(".player-two--x").classList.add("active-symbol");
            playerSymbolData.playerOneSymbol = "o";
            playerSymbolData.playerTwoSymbol = "x";
        }
    }
};

initialize();

/* Event Listeners */
homeButton.addEventListener("click", function () {
    window.location.href = "./index.html";
});

playerForm.addEventListener("submit", getUserData);

playerOneSymbolContainer.addEventListener("click", setPlayerSymbol);
playerTwoSymbolContainer.addEventListener("click", setPlayerSymbol);

closeModalButton.addEventListener("click", closeModal);

document.body.addEventListener("click", closeModal);
document.body.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeModal();
    }
});
