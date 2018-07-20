import {
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  PLAYABLE_VERTICES
} from "./constants";

export function getPixelCoordinatesFromBoardCoordinates(coordinate) {
  const [x, y] = coordinate.split(",");
  const circleXOffset = TRIANGLE_HEIGHT / 2 + 8;
  const circleYOffset = TRIANGLE_HEIGHT / 2 + 8;

  const offsetXToCenter =
    window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH + circleXOffset;
  const offsetYToCenter =
    window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT + circleYOffset;

  const offsetX =
    x * TRIANGLE_SIDE_LENGTH - Math.max(4 - y, 0) * TRIANGLE_SIDE_LENGTH;

  const xPos =
    (Math.abs(4 - y) * TRIANGLE_SIDE_LENGTH) / 2 + offsetX + offsetXToCenter;

  const yPos = y * TRIANGLE_HEIGHT + offsetYToCenter;
  return `${xPos},${yPos}`;
}

export function getBoardCoordinatesFromPixelCoordinates(x, y) {
  const circleXOffset = TRIANGLE_HEIGHT / 2 + 8;
  const circleYOffset = TRIANGLE_HEIGHT / 2 + 8;

  const offsetXToCenter =
    (window.innerWidth / 2 - 4 * TRIANGLE_SIDE_LENGTH + circleXOffset) /
    TRIANGLE_SIDE_LENGTH;
  const offsetYToCenter =
    (window.innerHeight / 2 - 4 * TRIANGLE_HEIGHT + circleYOffset) /
    TRIANGLE_HEIGHT;

  const yPos = y / TRIANGLE_HEIGHT - offsetYToCenter;

  const interimX = x / TRIANGLE_SIDE_LENGTH - offsetXToCenter;

  const offsetXBecauseY =
    (Math.abs(4 - yPos) * TRIANGLE_SIDE_LENGTH) / 2 / TRIANGLE_SIDE_LENGTH;

  const offsetXBecauseAnotherY = Math.max(4 - yPos, 0);

  const xPos = interimX - offsetXBecauseY + offsetXBecauseAnotherY;

  const xCoord = Math.round(xPos);
  const yCoord = Math.round(yPos);
  return `${xCoord},${yCoord}`;
}

export function goWest(coordinate) {
  let [x, y] = coordinate.split(",");
  x = Number(x);
  y = Number(y);

  return `${x - 1},${y}`;
}

export function goEast(coordinate) {
  let [x, y] = coordinate.split(",");

  x = Number(x);
  y = Number(y);

  return `${x + 1},${y}`;
}

export function goNorthWest(coordinate) {
  let [x, y] = coordinate.split(",");

  x = Number(x);
  y = Number(y);

  return `${x},${y - 1}`;
}

export function goNorthEast(coordinate) {
  let [x, y] = coordinate.split(",");
  x = Number(x);
  y = Number(y);

  return `${x + 1},${y - 1}`;
}

export function goSouthWest(coordinate) {
  let [x, y] = coordinate.split(",");

  x = Number(x);
  y = Number(y);

  return `${x - 1},${y + 1}`;
}

export function goSouthEast(coordinate) {
  let [x, y] = coordinate.split(",");
  x = Number(x);
  y = Number(y);

  return `${x},${y + 1}`;
}

export function isPlayableSpace(coordinate) {
  return PLAYABLE_VERTICES.includes(coordinate);
}
