import {
  TRIANGLE_HEIGHT,
  TOTT,
  PLAYER_ONE,
  PLAYER_TWO,
  TZAAR,
  TZARRA,
  PIXEL_RATIO,
  GamePieceRecord
} from "./constants";

export const PLAYER_ONE_TOTT = document.createElement("canvas");
export const PLAYER_ONE_TZARRA = document.createElement("canvas");
export const PLAYER_ONE_TZAAR = document.createElement("canvas");
export const PLAYER_TWO_TOTT = document.createElement("canvas");
export const PLAYER_TWO_TZARRA = document.createElement("canvas");
export const PLAYER_TWO_TZAAR = document.createElement("canvas");

export const GAME_PIECE_RADIUS = TRIANGLE_HEIGHT / 2.5;
export const CANVAS_SIDE_LENGTH = GAME_PIECE_RADIUS * PIXEL_RATIO * 2;
const CANVAS_STYLE_LENGTH = `${GAME_PIECE_RADIUS * 2}px`;

PLAYER_ONE_TOTT.width = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TOTT.height = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TOTT.style.width = CANVAS_STYLE_LENGTH;
PLAYER_ONE_TOTT.style.height = CANVAS_STYLE_LENGTH;

PLAYER_ONE_TZARRA.width = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TZARRA.height = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TZARRA.style.width = CANVAS_STYLE_LENGTH;
PLAYER_ONE_TZARRA.style.height = CANVAS_STYLE_LENGTH;

PLAYER_ONE_TZAAR.width = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TZAAR.height = CANVAS_SIDE_LENGTH;
PLAYER_ONE_TZAAR.style.width = CANVAS_STYLE_LENGTH;
PLAYER_ONE_TZAAR.style.height = CANVAS_STYLE_LENGTH;

PLAYER_TWO_TZARRA.width = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TZARRA.height = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TZARRA.style.width = CANVAS_STYLE_LENGTH;
PLAYER_TWO_TZARRA.style.height = CANVAS_STYLE_LENGTH;

PLAYER_TWO_TOTT.width = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TOTT.height = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TOTT.style.width = CANVAS_STYLE_LENGTH;
PLAYER_TWO_TOTT.style.height = CANVAS_STYLE_LENGTH;

PLAYER_TWO_TZAAR.width = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TZAAR.height = CANVAS_SIDE_LENGTH;
PLAYER_TWO_TZAAR.style.width = CANVAS_STYLE_LENGTH;
PLAYER_TWO_TZAAR.style.height = CANVAS_STYLE_LENGTH;

PLAYER_ONE_TOTT.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);
PLAYER_ONE_TZARRA.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);
PLAYER_ONE_TZAAR.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);

PLAYER_TWO_TOTT.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);
PLAYER_TWO_TZARRA.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);
PLAYER_TWO_TZAAR.getContext("2d").setTransform(
  PIXEL_RATIO,
  0,
  0,
  PIXEL_RATIO,
  0,
  0
);

const playerOneTott = new GamePieceRecord({
  type: TOTT,
  ownedBy: PLAYER_ONE
});
const playerOneTzarra = new GamePieceRecord({
  type: TZARRA,
  ownedBy: PLAYER_ONE
});
const playerOneTzaar = new GamePieceRecord({
  type: TZAAR,
  ownedBy: PLAYER_ONE
});

const playerTwoTott = new GamePieceRecord({
  type: TOTT,
  ownedBy: PLAYER_TWO
});
const playerTwoTzarra = new GamePieceRecord({
  type: TZARRA,
  ownedBy: PLAYER_TWO
});
const playerTwoTzaar = new GamePieceRecord({
  type: TZAAR,
  ownedBy: PLAYER_TWO
});

const circleRadius = GAME_PIECE_RADIUS;
const smallerCircleRadius = GAME_PIECE_RADIUS / 2;

const CENTER_COLOR = "#FDD835";
const PLAYER_ONE_COLOR_BG = "#1E88E5";
const PLAYER_TWO_COLOR_BG = "#212121";

function drawGamePiece(gamePiece, canvas) {
  const context = canvas.getContext("2d");
  if (gamePiece.ownedBy === PLAYER_ONE) {
    context.fillStyle = PLAYER_ONE_COLOR_BG;
    context.beginPath();
    context.arc(circleRadius, circleRadius, circleRadius - 2, 0, 2 * Math.PI);
    context.fill();
  } else {
    context.fillStyle = PLAYER_TWO_COLOR_BG;
    context.beginPath();
    context.arc(circleRadius, circleRadius, circleRadius - 2, 0, 2 * Math.PI);
    context.fill();
  }

  if (gamePiece.type === TZAAR) {
    context.fillStyle = CENTER_COLOR;
    context.beginPath();
    context.arc(
      circleRadius,
      circleRadius,
      smallerCircleRadius * 0.8,
      0,
      2 * Math.PI
    );
    context.fill();
  } else if (gamePiece.type === TZARRA) {
    context.strokeStyle = CENTER_COLOR;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(
      circleRadius,
      circleRadius,
      smallerCircleRadius,
      0,
      2 * Math.PI
    );
    context.stroke();
  }
}

drawGamePiece(playerOneTott, PLAYER_ONE_TOTT);
drawGamePiece(playerOneTzarra, PLAYER_ONE_TZARRA);
drawGamePiece(playerOneTzaar, PLAYER_ONE_TZAAR);
drawGamePiece(playerTwoTott, PLAYER_TWO_TOTT);
drawGamePiece(playerTwoTzarra, PLAYER_TWO_TZARRA);
drawGamePiece(playerTwoTzaar, PLAYER_TWO_TZAAR);
