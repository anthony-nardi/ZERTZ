import { GAME_STATE_BOARD_CANVAS, PLAYER_TWO } from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  drawMarblePool,
  drawHoveringCoordinate
} from "./renderHelpers";
import {
  getBoardCoordinatesFromPixelCoordinates,
  canRemoveRing
} from "./gameBoardHelpers";
import {
  movingPiece,
  gameBoardState,
  setNewgameBoardState,
  setMovingPiece,
  nextPhase,
  currentTurn,
  turnPhase,
  setHoveringCoordinate,
  hoveringCoordinate,
  availableRings,
  removeRing
} from "./gameState";

function getPixelCoordinatesFromUserInteraction(event) {
  const x = event.x || event.offsetX || event.changedTouches[0].clientX;
  const y = event.y || event.offsetY || event.changedTouches[0].clientY;
  return [x, y];
}

function clickedMarbleInPool(boardCoordinate) {
  return ["1,7", "2,7", "3,7"].includes(boardCoordinate);
}

function handleClickPiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  if (canRemoveRing(boardCoordinate, availableRings, gameBoardState)) {
    removeRing(boardCoordinate);
    drawInitialGrid();
    drawGameBoardState();
    drawCoordinates();
    drawMarblePool();
    return;
  }

  if (currentTurn === PLAYER_TWO) {
    return;
  }

  if (clickedMarbleInPool(boardCoordinate)) {
    setMovingPiece(boardCoordinate);
    return;
  }

  if (!gameBoardState.get(boardCoordinate)) {
    return;
  }

  setNewgameBoardState(
    gameBoardState.setIn([boardCoordinate, "isDragging"], true)
  );

  setMovingPiece(boardCoordinate);
}

function handleMovePiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);
  setHoveringCoordinate(boardCoordinate);

  if (!movingPiece) {
    return;
  }

  drawGameBoardState();
  drawGamePiece(movingPiece, x, y);
  drawMarblePool();
  drawHoveringCoordinate();
}

function getMarbleByBoardCoordinate(boardCoordinate) {
  if (boardCoordinate === "1,7") {
    return "BLACK";
  }
  if (boardCoordinate === "2,7") {
    return "GRAY";
  }
  if (boardCoordinate === "3,7") {
    return "WHITE";
  }

  return gameBoardState.get(boardCoordinate);
}

function handleDropPiece(event) {
  if (!movingPiece) {
    return;
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const toCoordinates = getBoardCoordinatesFromPixelCoordinates(x, y);

  if (!availableRings.includes(toCoordinates)) {
    setMovingPiece(null);
    drawGameBoardState();
    drawMarblePool();
    return;
  }

  setNewgameBoardState(
    gameBoardState.set(toCoordinates, getMarbleByBoardCoordinate(movingPiece))
  );

  setMovingPiece(null);
  drawGameBoardState();
  drawMarblePool();
}

export function initGame() {
  drawInitialGrid();
  drawGameBoardState();
  drawCoordinates();
  drawMarblePool();
}

const isMobile = "ontouchstart" in document.documentElement;
const mouseUpEvent = isMobile ? "touchend" : "mouseup";
const mouseDownEvent = isMobile ? "touchstart" : "mousedown";
const mouseMoveEvent = isMobile ? "touchmove" : "mousemove";

GAME_STATE_BOARD_CANVAS.addEventListener(mouseDownEvent, handleClickPiece);
GAME_STATE_BOARD_CANVAS.addEventListener(mouseMoveEvent, handleMovePiece);
GAME_STATE_BOARD_CANVAS.addEventListener(mouseUpEvent, handleDropPiece);
