import { List, Map } from "immutable";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  NUMBER_OF_BLACK_MARBLES,
  NUMBER_OF_WHITE_MARBLES,
  NUMBER_OF_GRAY_MARBLES,
  PLACE_MARBLE_OR_JUMP,
  PLAYABLE_VERTICES
} from "./constants";

export let movingPiece = null;
export let hoveringCoordinate = null;
export let gameBoardState = Map();
export let currentTurn = PLAYER_ONE;
export let currentPhase = PLACE_MARBLE_OR_JUMP;
export let availableWhiteMarbles = NUMBER_OF_WHITE_MARBLES;
export let availableGrayMarbles = NUMBER_OF_GRAY_MARBLES;
export let availableBlackMarbles = NUMBER_OF_BLACK_MARBLES;
export let availableRings = PLAYABLE_VERTICES;
export let isMovingMarbleFromPool = false;
export let capturedMarbles = {
  [PLAYER_ONE]: [],
  [PLAYER_TWO]: []
};

export function addToPlayersCapturedMarbles(player, marble) {
  capturedMarbles[player].push(marble);
}

export function setMovingMarbleFromPool(isMovingMarble) {
  isMovingMarbleFromPool = isMovingMarble;
}

export function removeRing(boardCoordinate) {
  availableRings.splice(availableRings.indexOf(boardCoordinate), 1);
}

export function setNextTurn() {
  if (currentTurn === PLAYER_ONE) {
    currentTurn = PLAYER_TWO;
  } else {
    currentTurn = PLAYER_ONE;
  }
}

export function setPhase(phase) {
  currentPhase = phase;
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

export function setHoveringCoordinate(coordinate) {
  hoveringCoordinate = coordinate;
}
