import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import {
  DEBUG,
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  GAME_STATE_BOARD_CANVAS,
  PLAYER_ONE,
  PLAYER_TWO,
  GamePieceRecord,
  BLACK,
  WHITE,
  GRAY
} from "./constants";
import { drawCachedBoard } from "./cachedBoard";
import {
  gameState,
  updateGameState,
  hoveringCoordinate,
  currentTurn
} from "./gameState";
import { List } from "immutable";

function getContext() {
  return GAME_STATE_BOARD_CANVAS.getContext("2d");
}

export function drawCapturedPieces() {
  const context = getContext();
  const playerOneWhite = gameState.getIn([
    "capturedMarbles",
    PLAYER_ONE,
    WHITE
  ]);
  const playerOneGray = gameState.getIn(["capturedMarbles", PLAYER_ONE, GRAY]);
  const playerOneBlack = gameState.getIn([
    "capturedMarbles",
    PLAYER_ONE,
    BLACK
  ]);
  const playerTwoWhite = gameState.getIn([
    "capturedMarbles",
    PLAYER_TWO,
    WHITE
  ]);
  const playerTwoGray = gameState.getIn(["capturedMarbles", PLAYER_TWO, GRAY]);
  const playerTwoBlack = gameState.getIn([
    "capturedMarbles",
    PLAYER_TWO,
    BLACK
  ]);

  const playerOneY = window.innerHeight - 60;
  const playerTwoY = window.innerHeight - 25;
  const playerOneX = 32;
  const playerTwoX = 32;

  context.fillText("Player: ", playerOneX, playerOneY);

  drawGamePieceByColor(BLACK, playerOneX + 50, playerOneY, playerOneBlack);

  drawGamePieceByColor(GRAY, playerOneX + 90, playerOneY, playerOneGray);

  drawGamePieceByColor(WHITE, playerOneX + 130, playerOneY, playerOneWhite);

  context.fillText("AI: ", playerTwoX, playerTwoY);

  drawGamePieceByColor(BLACK, playerTwoX + 50, playerTwoY, playerTwoBlack);

  drawGamePieceByColor(GRAY, playerTwoX + 90, playerTwoY, playerTwoGray);

  drawGamePieceByColor(WHITE, playerTwoX + 130, playerTwoY, playerTwoWhite);
}
export function drawCurrentTurn() {
  const context = getContext();
  if (currentTurn === PLAYER_ONE) {
    context.fillText("Current Turn: Player", 32, 50);
  } else {
    context.fillText("Current Turn: AI", 32, 50);
  }
}
export function drawCoordinates() {
  if (!DEBUG) {
    return;
  }
  gameState.get("availableRings").map(drawCoordinate);
}

export function drawCoordinate(coordinate) {
  const context = getContext();
  const [x, y] = coordinate.split(",");

  const offsetXToCenter = window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter = window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT;

  const offsetX =
    x * TRIANGLE_SIDE_LENGTH -
    Math.max(4 - y, 0) * TRIANGLE_SIDE_LENGTH +
    TRIANGLE_HEIGHT / 2 -
    8;

  const xPos =
    (Math.abs(4 - y) * TRIANGLE_SIDE_LENGTH) / 2 + offsetX + offsetXToCenter;

  const yPos = y * TRIANGLE_HEIGHT + offsetYToCenter;
  context.font = ".5rem Helvetica";
  context.fillStyle = "#fff";
  context.fillText(coordinate, xPos + 10, yPos + 10);
}

export function drawGameBoardState() {
  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  drawCapturedPieces();
  drawCurrentTurn();
  drawCoordinates();
}

export function drawStaticGamePiece(gamePiece, coordinate) {
  const [xPos, yPos] = getPixelCoordinatesFromBoardCoordinates(
    coordinate
  ).split(",");

  if (!gamePiece || gamePiece.isDragging) {
    return;
  }

  drawGamePiece(coordinate, xPos, yPos);
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
}

export function drawHoveringGamePiece(coord, x, y, board) {
  const gamePiece = getMarbleByBoardCoordinate(coord) || board.get(coord);
  const context = getContext();
  context.shadowBlur = 100;
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  context.shadowColor = "black";
  if (gamePiece.color === "BLACK") {
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();
  }
  if (gamePiece.color === "GRAY") {
    context.fillStyle = "#ccc";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  if (gamePiece.color === "WHITE") {
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  context.shadowBlur = 0;
}

export function drawGamePieceByColor(color, x, y, count) {
  const hasCount = typeof count === "number";
  const context = getContext();

  context.strokeStyle = "#000";
  context.lineWidth = 2;

  if (color === BLACK) {
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();

    if (hasCount) {
      context.fillStyle = "#fff";
      context.fillText(count, x - 3, y + 3);
    }
  }
  if (color === GRAY) {
    context.fillStyle = "#ccc";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    if (hasCount) {
      context.fillStyle = "#000";
      context.fillText(count, x - 3, y + 3);
    }
  }
  if (color === WHITE) {
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(Number(x), Number(y), 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    if (hasCount) {
      context.fillStyle = "#000";
      context.fillText(count, x - 3, y + 3);
    }
  }
}

export function drawGamePiece(coord, x, y) {
  const gamePiece =
    gameState.get("board").get(coord) || getMarbleByBoardCoordinate(coord);
  const context = getContext();

  context.strokeStyle = "#000";
  context.lineWidth = 2;

  drawGamePieceByColor(gamePiece.color, x, y);
}

export function drawGamePieces() {
  gameState.get("board").forEach(drawStaticGamePiece);
}

export function clearCanvas() {
  const context = getContext();
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function timeFunction(t) {
  return --t * t * t + 1;
}

export function renderInitializingBoard(piecesToDraw, callback) {
  let index = 0;
  let piecesToRenderList = List();
  piecesToDraw.forEach((piece, coordinate) => {
    const to = getPixelCoordinatesFromBoardCoordinates(coordinate);
    const from = `${window.innerWidth / 2},${window.innerHeight / 2}`;

    piecesToRenderList = piecesToRenderList.push({
      piece,
      from,
      to,
      delay: index * 25
    });

    index = index + 1;
  });

  renderMovingPieces(piecesToRenderList, 500, Date.now(), () => {
    let index = 0;
    piecesToDraw.forEach((piece, coordinate) => {
      updateGameState(gameState.get("board").set(coordinate, piece));
      index = index + 1;
    });
    callback();
  });
}

function renderMovingPieces(piecesToRenderList, duration, startTime, callback) {
  const now = Date.now();

  const timePassedInMilliSec = now - startTime;

  if (timePassedInMilliSec > duration + piecesToRenderList.last().delay) {
    callback();
    return;
  }

  clearCanvas();
  drawCachedBoard();

  piecesToRenderList.forEach(({ piece, from, to, delay }) => {
    const timePassed = Math.min(
      Math.max((now - startTime - delay) / duration, 0),
      1
    );

    const [fromX, fromY] = from.split(",");
    const [toX, toY] = to.split(",");

    const distance = Math.sqrt(
      Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
    );

    const currentDistance = (timeFunction(timePassed) * distance) / distance;

    const renderX = (1 - currentDistance) * fromX + currentDistance * toX;
    const renderY = (1 - currentDistance) * fromY + currentDistance * toY;

    drawGamePiece(piece, renderX, renderY);
  });

  window.requestAnimationFrame(() => {
    renderMovingPieces(piecesToRenderList, duration, startTime, callback);
  });
}

export function renderMovingPiece(
  piece,
  from,
  to,
  duration,
  startTime,
  callback
) {
  const now = Date.now();

  const timePassedInMilliSec = now - startTime;

  if (timePassedInMilliSec > duration) {
    callback();
    return;
  }

  const timePassed = Math.min(Math.max((now - startTime) / duration, 0), 1);

  const [fromX, fromY] = from.split(",");
  const [toX, toY] = to.split(",");

  const distance = Math.sqrt(
    Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2)
  );

  const currentDistance = (timeFunction(timePassed) * distance) / distance;

  const renderX = (1 - currentDistance) * fromX + currentDistance * toX;
  const renderY = (1 - currentDistance) * fromY + currentDistance * toY;

  clearCanvas();
  drawCachedBoard();
  drawGamePieces();
  drawGamePiece(piece, renderX, renderY);

  window.requestAnimationFrame(() => {
    renderMovingPiece(piece, from, to, duration, startTime, callback);
  });
}

export function drawHoveringCoordinate() {
  const [x, y] = getPixelCoordinatesFromBoardCoordinates(
    hoveringCoordinate
  ).split(",");

  const context = getContext();

  if (!gameState.get("availableRings").includes(hoveringCoordinate)) {
    return;
  }

  context.beginPath();
  context.arc(x, y, TRIANGLE_HEIGHT / 2, 0, Math.PI * 2);
  context.lineWidth = 8;
  context.strokeStyle = "#fe33e3";
  context.stroke();
}

export function drawMarblePool() {
  const availableBlackMarbles = gameState.getIn(["availableMarbles", BLACK]);
  const availableGrayMarbles = gameState.getIn(["availableMarbles", GRAY]);
  const availableWhiteMarbles = gameState.getIn(["availableMarbles", WHITE]);
  const context = getContext();
  const offsetY = 0;
  const offsetX = 0;

  context.strokeStyle = "#000";
  context.lineWidth = 2;

  if (availableBlackMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${1},${7}`).split(
      ","
    );
    drawGamePieceByColor(
      BLACK,
      Number(x) + offsetX,
      Number(y) + offsetY,
      availableBlackMarbles
    );
  }
  if (availableGrayMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${2},${7}`).split(
      ","
    );
    drawGamePieceByColor(
      GRAY,
      Number(x) + offsetX,
      Number(y) + offsetY,
      availableGrayMarbles
    );
  }
  if (availableWhiteMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${3},${7}`).split(
      ","
    );
    drawGamePieceByColor(
      WHITE,
      Number(x) + offsetX,
      Number(y) + offsetY,
      availableWhiteMarbles
    );
  }
}
