"use strict";

/* Variables */

const setThemeButton = document.querySelector(".header__theme-button");
const lightIcon = document.querySelector(".header__theme--light");
const darkIcon = document.querySelector(".header__theme--dark");

const header = document.querySelector(".header");

const playerInput = document.querySelectorAll(".player-text");
const labels = document.querySelectorAll(".label__name");
const allSymbols = document.querySelectorAll(".symbol");
const formSubmit = document.querySelector(".submit__button");

const mainGame = document.querySelector(".main");
const mainSeparators = document.querySelectorAll(".main__separator");
const squares = document.querySelectorAll(".square");
const playAgainButton = document.querySelector(".play-again-button");

const footer = document.querySelector(".footer");

const copyrightYear = document.querySelector(".copyright-year");

let currentTheme;
let targetTheme;
let individualElements = [];
let linkContainers = document.querySelectorAll(".link-icon");
let myLinks = [
    "https://twitter.com/skk_dev",
    "https://github.com/Karthik-315",
    "https://www.buymeacoffee.com/skdev",
];

/* Functions */
const groupIndividualElements = function () {
    // Store elements in an array and iterate over them to switch theme.
    individualElements.push(header);
    individualElements.push(formSubmit);
    individualElements.push(mainGame);
    individualElements.push(playAgainButton);

    individualElements.push(allSymbols);
    individualElements.push(playerInput);
    individualElements.push(labels);
    individualElements.push(mainSeparators);
    individualElements.push(squares);

    individualElements.push(footer);
};

const setTheme = function (theme) {
    if (
        (document.body.classList.contains("light-mode") && theme === "light") ||
        (!document.body.classList.contains("light-mode") && theme === "dark")
    ) {
        return;
    }

    // Toggle light mode
    document.body.classList.toggle("light-mode");

    individualElements.forEach((element) => {
        if (element) {
            // Handle nodeLists using Array.
            if (NodeList.prototype.isPrototypeOf(element)) {
                Array.from(element).forEach((elem) =>
                    elem.classList.toggle("light-mode")
                );
            } else {
                element.classList.toggle("light-mode");
            }
        }
    });
};

const setThemeIcon = function () {
    if (currentTheme === "light") {
        lightIcon.classList.add("hidden");
        darkIcon.classList.remove("hidden");
    } else {
        lightIcon.classList.remove("hidden");
        darkIcon.classList.add("hidden");
    }
};

const computeTheme = function () {
    //Switch themes and store it.
    if (currentTheme === "dark") {
        currentTheme = "light";
    } else if (currentTheme === "light") {
        currentTheme = "dark";
    }

    window.localStorage.setItem("theme", currentTheme);
    setThemeIcon();
    setTheme(currentTheme);
};

const setDefaults = function () {
    groupIndividualElements();

    currentTheme = window.localStorage.getItem("theme") || "dark";

    setThemeIcon();
    setTheme(currentTheme);

    const thisYear = new Date().getFullYear();
    copyrightYear.innerHTML = thisYear;
};

const setLinks = function () {
    Array.from(linkContainers).forEach((link, index) => {
        link.href = myLinks[index];
    });
};

setDefaults();
setLinks();

/* Event Listeners */
setThemeButton.addEventListener("click", computeTheme);
