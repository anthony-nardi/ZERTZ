import { initGame } from "./gameLogic";

function startNewGame() {
  document.documentElement.classList.add("hideOverflow");
  document.getElementById("gameMenuDiv").classList.add("hidden");
  document.getElementById("gameStateBoardDiv").classList.remove("hidden");
  document.getElementById("gameStateDiv").classList.remove("hidden");
  initGame();
}

function backToGameMenu() {
  document.getElementById("gameMenuDiv").classList.remove("hidden");
  document.getElementById("rulesDiv").classList.add("hidden");
}

function showRules() {
  document.getElementById("gameMenuDiv").classList.add("hidden");
  document.getElementById("rulesDiv").classList.remove("hidden");
}

function startApp() {
  document.getElementById("newGameDiv").addEventListener("click", startNewGame);
  document.getElementById("showRulesDiv").addEventListener("click", showRules);
  document
    .getElementById("backToGameMenuDiv")
    .addEventListener("click", backToGameMenu);
}
window.addEventListener("DOMContentLoaded", startApp, false);
