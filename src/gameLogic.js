import {
  GAME_STATE_BOARD_CANVAS,
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
  drawMarblePool,
  drawHoveringCoordinate,
  drawHoveringGamePiece
} from "./renderHelpers";
import {
  getBoardCoordinatesFromPixelCoordinates,
  canRemoveRing,
  isMarbleAbleToCapture,
  getValidJumps,
  getJumpedMarble,
  canRemoveAnyRing,
  isGroupIsolated
} from "./gameBoardHelpers";
import {
  gameState,
  movingPiece,
  setMovingPiece,
  currentTurn,
  currentPhase,
  setHoveringCoordinate,
  removeRing,
  setMovingMarbleFromPool,
  isMovingMarbleFromPool,
  setPhase,
  setNextTurn,
  addToPlayersCapturedMarbles,
  decrementNumberOfAvailableMarbles,
  updateGameState
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
  return gameState.get("board").filter(marble => marble);
}

function mustJumpMarble() {
  const marbles = getAllMarblesOnBoard();

  let canCapture = false;

  if (!marbles) {
    return false;
  }

  marbles.keySeq().forEach(marbleCoordinate => {
    if (
      isMarbleAbleToCapture(
        marbleCoordinate,
        gameState.get("availableRings"),
        gameState.get("board")
      )
    ) {
      canCapture = true;
    }
  });
  return canCapture;
}

function isPieceAbleToJump(marbleCoordinate) {
  return isMarbleAbleToCapture(
    marbleCoordinate,
    gameState.get("availableRings"),
    gameState.get("board")
  );
}

function handleClickPiece(event) {
  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const boardCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  // Clicks invalid location
  if (
    !gameState.get("availableRings").includes(boardCoordinate) &&
    !clickedMarbleInPool(boardCoordinate)
  ) {
    return;
  }

  // We must remove a ring.
  if (currentPhase === REMOVE_RING) {
    if (
      canRemoveRing(
        boardCoordinate,
        gameState.get("availableRings"),
        gameState.get("board")
      )
    ) {
      removeRing(boardCoordinate);
      if (isGroupIsolated(gameState)) {
        debugger;
      }
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
    updateGameState(
      "board",
      gameState.get("board").setIn([boardCoordinate, "isDragging"], true)
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
  drawHoveringGamePiece(movingPiece, x, y, gameState.get("board"));
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

  return gameState.get("board").get(boardCoordinate);
}

function handleDropPiece(event) {
  if (!movingPiece) {
    return;
  }

  const [x, y] = getPixelCoordinatesFromUserInteraction(event);
  const toCoordinate = getBoardCoordinatesFromPixelCoordinates(x, y);

  // Drops piece onto invalid spot
  if (
    !gameState.get("availableRings").includes(toCoordinate) ||
    gameState.get("board").get(toCoordinate)
  ) {
    if (gameState.get("board").get(movingPiece)) {
      updateGameState(
        "board",
        gameState.get("board").setIn([movingPiece, "isDragging"], false)
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
      getValidJumps(
        movingPiece,
        gameState.get("availableRings"),
        gameState.get("board")
      ).includes(toCoordinate)
    ) {
      const jumpedCoordinate = getJumpedMarble(movingPiece, toCoordinate);

      addToPlayersCapturedMarbles(
        currentTurn,
        gameState.get("board").get(jumpedCoordinate)
      );

      updateGameState(
        "board",
        gameState
          .get("board")
          .set(toCoordinate, gameState.get("board").get(movingPiece))
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
      drawGameBoardState();
      drawMarblePool();
      return;
    } else {
      updateGameState(
        "board",
        gameState.get("board").setIn([movingPiece, "isDragging"], false)
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
    updateGameState(
      "board",
      gameState
        .get("board")
        .set(toCoordinate, getMarbleByBoardCoordinate(movingPiece))
    );
    decrementNumberOfAvailableMarbles(
      getMarbleByBoardCoordinate(movingPiece).color
    );

    setMovingMarbleFromPool(false);

    setMovingPiece(null);
    drawGameBoardState();
    drawMarblePool();

    if (
      canRemoveAnyRing(gameState.get("availableRings"), gameState.get("board"))
    ) {
      setPhase(REMOVE_RING);
    } else {
      setPhase(PLACE_MARBLE_OR_JUMP);
      setNextTurn();
    }

    return;
  }
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
