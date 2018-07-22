import { getPixelCoordinatesFromBoardCoordinates } from "./gameBoardHelpers";
import {
  DEBUG,
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  PLAYABLE_VERTICES,
  GAME_STATE_BOARD_CANVAS,
  TOTT,
  TZAAR,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  PIXEL_RATIO,
  GamePieceRecord,
  BLACK,
  WHITE,
  GRAY
} from "./constants";
import { drawCachedBoard } from "./cachedBoard";
import {
  gameBoardState,
  setNewgameBoardState,
  availableBlackMarbles,
  availableGrayMarbles,
  availableWhiteMarbles,
  hoveringCoordinate,
  availableRings
} from "./gameState";
import { List } from "immutable";
import {
  PLAYER_ONE_TOTT,
  PLAYER_ONE_TZAAR,
  PLAYER_ONE_TZARRA,
  PLAYER_TWO_TOTT,
  PLAYER_TWO_TZAAR,
  PLAYER_TWO_TZARRA,
  GAME_PIECE_RADIUS,
  CANVAS_SIDE_LENGTH
} from "./gamePieceRenderer";

function getContext() {
  return GAME_STATE_BOARD_CANVAS.getContext("2d");
}

export function drawCoordinates() {
  if (!DEBUG) {
    return;
  }
  availableRings.map(drawCoordinate);
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
  drawCoordinates();
}

export function drawStaticGamePiece(gamePiece, coordinate) {
  const [xPos, yPos] = getPixelCoordinatesFromBoardCoordinates(
    coordinate
  ).split(",");

  if (gamePiece.isDragging || !gamePiece) {
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

export function drawGamePiece(coord, x, y) {
  const gamePiece =
    gameBoardState.get(coord) || getMarbleByBoardCoordinate(coord);
  const context = getContext();

  context.strokeStyle = "#000";
  context.lineWidth = 2;

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
}

export function drawGamePieces() {
  gameBoardState.forEach(drawStaticGamePiece);
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
      setNewgameBoardState(gameBoardState.set(coordinate, piece));
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

  if (!availableRings.includes(hoveringCoordinate)) {
    return;
  }

  context.beginPath();
  context.arc(x, y, TRIANGLE_HEIGHT / 2, 0, Math.PI * 2);
  context.lineWidth = 8;
  context.strokeStyle = "#fe33e3";
  context.stroke();
}

export function drawMarblePool() {
  const context = getContext();
  const offsetY = 0;
  const offsetX = 0;

  context.strokeStyle = "#000";
  context.lineWidth = 2;

  if (availableBlackMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${1},${7}`).split(
      ","
    );
    context.fillStyle = "#000";
    context.beginPath();
    context.arc(Number(x) + offsetX, Number(y) + offsetY, 16, 0, Math.PI * 2);
    context.fill();
  }
  if (availableGrayMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${2},${7}`).split(
      ","
    );
    context.fillStyle = "#ccc";
    context.beginPath();
    context.arc(Number(x) + offsetX, Number(y) + offsetY, 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
  if (availableWhiteMarbles) {
    const [x, y] = getPixelCoordinatesFromBoardCoordinates(`${3},${7}`).split(
      ","
    );
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(Number(x) + offsetX, Number(y) + offsetY, 16, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }
}
