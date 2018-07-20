import { List, Map } from "immutable";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  NUMBER_OF_BLACK_MARBLES,
  NUMBER_OF_WHITE_MARBLES,
  NUMBER_OF_GRAY_MARBLES
} from "./constants";

export let movingPiece = null;
export let gameBoardState = Map();
export let currentTurn = PLAYER_ONE;
export let availableWhiteMarbles = NUMBER_OF_WHITE_MARBLES;
export let availableGrayMarbles = NUMBER_OF_GRAY_MARBLES;
export let availableBlackMarbles = NUMBER_OF_BLACK_MARBLES;

export function setNextTurn() {
  if (currentTurn === PLAYER_ONE) {
    currentTurn = PLAYER_TWO;
  } else {
    currentTurn = PLAYER_ONE;
  }
}

export function setNumberOfAvailableMarbles(color, number) {
  if (color === "WHITE") {
    availableWhiteMarbles = number;
  }
  if (color === "GRAY") {
    availableGrayMarbles = number;
  }
  if (color === "BLACK") {
    availableBlackMarbles = number;
  }
}

export function setNewgameBoardState(newState) {
  gameBoardState = newState;
}

export function setMovingPiece(coordinate) {
  movingPiece = coordinate;
}
