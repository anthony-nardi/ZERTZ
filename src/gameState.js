import { Map, fromJS } from "immutable";
import {
  PLAYER_ONE,
  PLAYER_TWO,
  NUMBER_OF_BLACK_MARBLES,
  NUMBER_OF_WHITE_MARBLES,
  NUMBER_OF_GRAY_MARBLES,
  PLACE_MARBLE_OR_JUMP,
  PLAYABLE_VERTICES,
  BLACK,
  WHITE,
  GRAY
} from "./constants";

export let movingPiece = null; // Coordinate of the marble that is being moved
export let hoveringCoordinate = null; // Coordinate the mouse is over
export let currentTurn = PLAYER_ONE; // One of PLAYER_ONE, PLAYER_TWO
export let currentPhase = PLACE_MARBLE_OR_JUMP; //One of REMOVE_RING, PLACE_MARBLE_OR_JUMP
export let isMovingMarbleFromPool = false; // Player is moving a marble from the pool

export function isWinner(gameState) {
  const capturedMarbles = gameState.get("capturedMarbles");
  const playerOneMarbles = capturedMarbles.get(PLAYER_ONE);
  const playerTwoMarbles = capturedMarbles.get(PLAYER_TWO);

  if (
    playerOneMarbles.get(WHITE) >= 3 &&
    playerOneMarbles.get(GRAY) >= 3 &&
    playerOneMarbles.get(BLACK) >= 3
  ) {
    return PLAYER_ONE;
  }
  if (
    playerTwoMarbles.get(WHITE) >= 3 &&
    playerTwoMarbles.get(GRAY) >= 3 &&
    playerTwoMarbles.get(BLACK) >= 3
  ) {
    return PLAYER_TWO;
  }
}

export function setMovingMarbleFromPool(isMovingMarble) {
  isMovingMarbleFromPool = isMovingMarble;
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

export function setMovingPiece(coordinate) {
  movingPiece = coordinate;
}

export function setHoveringCoordinate(coordinate) {
  hoveringCoordinate = coordinate;
}

export function addToPlayersCapturedMarbles(player, { color }) {
  gameState = gameState.updateIn(
    ["capturedMarbles", player, color],
    count => count + 1
  );
}

export function removeRing(boardCoordinate) {
  gameState = gameState.update("availableRings", availableRings => {
    return availableRings.splice(availableRings.indexOf(boardCoordinate), 1);
  });
}

export function decrementNumberOfAvailableMarbles(color) {
  gameState = gameState.updateIn(
    ["availableMarbles", color],
    count => count - 1
  );
}

export function updateGameState(path, newState) {
  gameState = gameState.set(path, newState);
}

export let gameState = Map({
  board: Map(),
  capturedMarbles: fromJS({
    [PLAYER_ONE]: {
      [WHITE]: 0,
      [GRAY]: 0,
      [BLACK]: 0
    },
    [PLAYER_TWO]: {
      [WHITE]: 0,
      [GRAY]: 0,
      [BLACK]: 0
    }
  }),
  availableRings: fromJS(PLAYABLE_VERTICES),
  availableMarbles: Map({
    [WHITE]: NUMBER_OF_WHITE_MARBLES,
    [GRAY]: NUMBER_OF_GRAY_MARBLES,
    [BLACK]: NUMBER_OF_BLACK_MARBLES
  })
});
