import {
  GAME_STATE_BOARD_CANVAS,
  PLAYER_TWO,
  REMOVE_RING,
  PLACE_MARBLE_OR_JUMP,
  BLACK,
  GRAY,
  WHITE,
  GamePieceRecord
} from "./constants";
import { drawInitialGrid } from "./cachedBoard";
import {
  drawCoordinates,
  drawGameBoardState,
  drawGamePiece,
  drawMarblePool,
  drawHoveringCoordinate,
  drawHoveringGamePiece
} from "./renderHelpers";
import {
  getBoardCoordinatesFromPixelCoordinates,
  canRemoveRing,
  isMarbleAbleToCapture,
  getValidJumps,
  getJumpedMarble
} from "./gameBoardHelpers";
import {
  movingPiece,
  gameBoardState,
  setNewgameBoardState,
  setMovingPiece,
  currentTurn,
  currentPhase,
  setHoveringCoordinate,
  availableRings,
  removeRing,
  setMovingMarbleFromPool,
  isMovingMarbleFromPool,
  setPhase,
  setNextTurn
} from "./gameState";

function getPixelCoordinatesFromUserInteraction(event) {
  const x = event.x || event.offsetX || event.changedTouches[0].clientX;
  const y = event.y || event.offsetY || event.changedTouches[0].clientY;
  return [x, y];
}

function clickedMarbleInPool(boardCoordinate) {
  return ["1,7", "2,7", "3,7"].includes(boardCoordinate);
}

function getAllMarblesOnBoard() {
  return gameBoardState.filter(marble => marble);
}

function mustJumpMarble() {
  const marbles = getAllMarblesOnBoard();
  let canCapture = false;
  if (!marbles) {
    return false;
  }

  marbles.keySeq().forEach(coordinate => {
    if (isMarbleAbleToCapture(coordinate, availableRings, gameBoardState)) {
      canCapture = true;
    }
  });
  return canCapture;
}

function isPieceAbleToJump(coordinate) {
  return isMarbleAbleToCapture(coordinate, availableRings, gameBoardState);
}

function handleClickPiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  // Clicks invalid location
  if (
    !availableRings.includes(boardCoordinate) &&
    !clickedMarbleInPool(boardCoordinate)
  ) {
    return;
  }

  // We must remove a ring.
  if (currentPhase === REMOVE_RING) {
    if (canRemoveRing(boardCoordinate, availableRings, gameBoardState)) {
      removeRing(boardCoordinate);
      setNextTurn();
      setPhase(PLACE_MARBLE_OR_JUMP);
      drawInitialGrid();
      drawGameBoardState();
      drawCoordinates();
      drawMarblePool();
    }
    return;
  }

  // We must capture
  if (mustJumpMarble()) {
    if (!isPieceAbleToJump(boardCoordinate)) {
      return;
    }
    setNewgameBoardState(
      gameBoardState.setIn([boardCoordinate, "isDragging"], true)
    );

    setMovingPiece(boardCoordinate);
    return;
  }

  // if (currentTurn === PLAYER_TWO) {
  //   return;
  // }

  // We must place new marble
  if (clickedMarbleInPool(boardCoordinate)) {
    setMovingPiece(boardCoordinate);
    setMovingMarbleFromPool(true);
    return;
  }
}

function handleMovePiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  if (!movingPiece) {
    return;
  }
  setHoveringCoordinate(boardCoordinate);
  drawGameBoardState();
  drawHoveringGamePiece(movingPiece, x, y);
  drawMarblePool();
  drawHoveringCoordinate();
}

function getMarbleByBoardCoordinate(boardCoordinate) {
  if (boardCoordinate === "1,7") {
    return new GamePieceRecord({ color: BLACK });
  }
  if (boardCoordinate === "2,7") {
    return new GamePieceRecord({ color: GRAY });
  }
  if (boardCoordinate === "3,7") {
    return new GamePieceRecord({ color: WHITE });
  }

  return gameBoardState.get(boardCoordinate);
}

function handleDropPiece(event) {
  if (!movingPiece) {
    return;
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const toCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  // Drops piece onto invalid spot
  if (
    !availableRings.includes(toCoordinate) ||
    gameBoardState.get(toCoordinate)
  ) {
    if (gameBoardState.get(movingPiece)) {
      setNewgameBoardState(
        gameBoardState.setIn([movingPiece, "isDragging"], false)
      );
    }
    setMovingMarbleFromPool(false);
    setMovingPiece(null);
    drawGameBoardState();
    drawMarblePool();
    return;
  }

  // We must capture
  if (mustJumpMarble()) {
    if (
      isPieceAbleToJump(movingPiece) &&
      getValidJumps(movingPiece, availableRings, gameBoardState).includes(
        toCoordinate
      )
    ) {
      const jumpedCoordinate = getJumpedMarble(movingPiece, toCoordinate);
      setNewgameBoardState(
        gameBoardState
          .set(toCoordinate, gameBoardState.get(movingPiece))
          .setIn([toCoordinate, "isDragging"], false)
          .set(jumpedCoordinate, null)
          .set(movingPiece, null)
      );
      setMovingMarbleFromPool(false);
      setMovingPiece(null);
      drawGameBoardState();
      drawMarblePool();

      if (mustJumpMarble()) {
        return;
      }

      setPhase(PLACE_MARBLE_OR_JUMP);
      setNextTurn();
      return;
    } else {
      setNewgameBoardState(
        gameBoardState.setIn([movingPiece, "isDragging"], false)
      );
      setMovingMarbleFromPool(false);
      setMovingPiece(null);
      drawGameBoardState();
      drawMarblePool();
      return;
    }
  }

  // We are moving marble from pool
  if (isMovingMarbleFromPool) {
    setNewgameBoardState(
      gameBoardState.set(toCoordinate, getMarbleByBoardCoordinate(movingPiece))
    );
    setMovingMarbleFromPool(false);
    setPhase(REMOVE_RING);
    setMovingPiece(null);
    drawGameBoardState();
    drawMarblePool();
    return;
  }

  alert("HOW?");
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
