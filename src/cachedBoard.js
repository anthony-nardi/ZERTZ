import {
  NUMBER_OF_COLS,
  NUMBER_OF_ROWS,
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  CACHED_CANVAS,
  GAME_STATE_BOARD_CANVAS,
  PIXEL_RATIO
} from "./constants";

const COORDS_TO_NOT_RENDER = [
  "0,0",
  "0,1",
  "1,0",
  "2,0",
  "3,0",
  "1,1",
  "2,1",
  "0,2",
  "1,2",
  "0,3",
  "7,5",
  "7,6",
  "6,7",
  "6,6",
  "5,7",
  "6,7",
  "7,7",
  "0,4",
  "0,5",
  "0,6",
  "0,7",
  "1,7",
  "2,7",
  "3,7",
  "4,7",
  "5,6",
  "6,5",
  "7,4"
];

const OFFSET_X = 0;

const grid = getInitialGridState();

function initCanvas() {
  CACHED_CANVAS.width = window.innerWidth * PIXEL_RATIO;
  CACHED_CANVAS.height = window.innerHeight * PIXEL_RATIO;
  CACHED_CANVAS.style.width = `${window.innerWidth}px`;
  CACHED_CANVAS.style.height = `${window.innerHeight}px`;

  GAME_STATE_BOARD_CANVAS.width = window.innerWidth * PIXEL_RATIO;
  GAME_STATE_BOARD_CANVAS.height = window.innerHeight * PIXEL_RATIO;
  GAME_STATE_BOARD_CANVAS.style.width = `${window.innerWidth}px`;
  GAME_STATE_BOARD_CANVAS.style.height = `${window.innerHeight}px`;

  CACHED_CANVAS.getContext("2d").setTransform(
    PIXEL_RATIO,
    0,
    0,
    PIXEL_RATIO,
    0,
    0
  );
  GAME_STATE_BOARD_CANVAS.getContext("2d").setTransform(
    PIXEL_RATIO,
    0,
    0,
    PIXEL_RATIO,
    0,
    0
  );
}

function getContext() {
  return CACHED_CANVAS.getContext("2d");
}

function getInitialGridState() {
  const vertices = [];

  for (let colIndex = 0; colIndex < NUMBER_OF_COLS; colIndex++) {
    for (let rowIndex = 0; rowIndex < NUMBER_OF_ROWS; rowIndex++) {
      vertices.push(`${colIndex},${rowIndex}`);
    }
  }

  return vertices;
}

function getImageData() {
  const context = getContext();
  return context.getImageData(
    OFFSET_X * PIXEL_RATIO,
    0,
    PIXEL_RATIO * window.innerWidth,
    PIXEL_RATIO * window.innerHeight
  );
}

export function drawCachedBoard() {
  const context = GAME_STATE_BOARD_CANVAS.getContext("2d");
  const imageData = getImageData();

  context.putImageData(
    imageData,
    (window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH) * PIXEL_RATIO,
    (window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT) * PIXEL_RATIO
  );
}

export function drawInitialGrid() {
  initCanvas();
  grid.map(renderTriangleFromVertex);
  drawCachedBoard();
  // renderSquareBorder();
}

function renderTriangleFromVertex(coordinate) {
  const context = getContext();

  if (COORDS_TO_NOT_RENDER.includes(coordinate)) {
    return;
  }
  const [x, y] = coordinate.split(",");

  const offsetX =
    (y * TRIANGLE_SIDE_LENGTH) / 2 -
    TRIANGLE_SIDE_LENGTH * 2 +
    TRIANGLE_HEIGHT / 2 +
    8;
  const offsetY = TRIANGLE_HEIGHT / 2 + 8;
  const startX = x * TRIANGLE_SIDE_LENGTH + offsetX;
  const startY = y * TRIANGLE_HEIGHT + offsetY;

  context.beginPath();
  context.arc(startX, startY, TRIANGLE_HEIGHT / 2, 0, Math.PI * 2);
  context.lineWidth = 8;
  context.strokeStyle = "#666666";
  context.stroke();
}

function renderSquareBorder() {
  const context = getContext();
  context.strokeRect(
    OFFSET_X,
    0,
    8 * TRIANGLE_SIDE_LENGTH,
    8 * TRIANGLE_HEIGHT
  );
}
