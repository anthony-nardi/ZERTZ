import {
  TRIANGLE_SIDE_LENGTH,
  TRIANGLE_HEIGHT,
  PLAYABLE_VERTICES
} from "./constants";
import { List } from "immutable";

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

export function getJumpedMarble(fromCoordinate, toCoordinate) {
  if (goNorthEast(goNorthEast(fromCoordinate)) === toCoordinate) {
    return goNorthEast(fromCoordinate);
  }
  if (goEast(goEast(fromCoordinate)) === toCoordinate) {
    return goEast(fromCoordinate);
  }
  if (goSouthEast(goSouthEast(fromCoordinate)) === toCoordinate) {
    return goSouthEast(fromCoordinate);
  }
  if (goSouthWest(goSouthWest(fromCoordinate)) === toCoordinate) {
    return goSouthWest(fromCoordinate);
  }
  if (goWest(goWest(fromCoordinate)) === toCoordinate) {
    return goWest(fromCoordinate);
  }
  if (goNorthWest(goNorthWest(fromCoordinate)) === toCoordinate) {
    return goNorthWest(fromCoordinate);
  }
  alert("hmm");
}

export function getValidJumps(fromCoordinate, availableRings, gameBoardState) {
  const availableJumps = [];

  if (
    gameBoardState.get(goNorthEast(fromCoordinate)) &&
    availableRings.includes(goNorthEast(goNorthEast(fromCoordinate)))
  ) {
    availableJumps.push(goNorthEast(goNorthEast(fromCoordinate)));
  }
  if (
    gameBoardState.get(goEast(fromCoordinate)) &&
    availableRings.includes(goEast(goEast(fromCoordinate)))
  ) {
    availableJumps.push(goEast(goEast(fromCoordinate)));
  }
  if (
    gameBoardState.get(goSouthEast(fromCoordinate)) &&
    availableRings.includes(goSouthEast(goSouthEast(fromCoordinate)))
  ) {
    availableJumps.push(goSouthEast(goSouthEast(fromCoordinate)));
  }
  if (
    gameBoardState.get(goSouthWest(fromCoordinate)) &&
    availableRings.includes(goSouthWest(goSouthWest(fromCoordinate)))
  ) {
    availableJumps.push(goSouthWest(goSouthWest(fromCoordinate)));
  }
  if (
    gameBoardState.get(goWest(fromCoordinate)) &&
    availableRings.includes(goWest(goWest(fromCoordinate)))
  ) {
    availableJumps.push(goWest(goWest(fromCoordinate)));
  }
  if (
    gameBoardState.get(goNorthWest(fromCoordinate)) &&
    availableRings.includes(goNorthWest(goNorthWest(fromCoordinate)))
  ) {
    availableJumps.push(goNorthWest(goNorthWest(fromCoordinate)));
  }
  return availableJumps;
}

export function isMarbleAbleToCapture(coordinate, availableRings, board) {
  if (!board.get(coordinate)) {
    return false;
  }

  if (
    board.get(goNorthEast(coordinate)) &&
    availableRings.includes(goNorthEast(goNorthEast(coordinate)))
  ) {
    return true;
  }

  if (
    board.get(goEast(coordinate)) &&
    availableRings.includes(goEast(goEast(coordinate)))
  ) {
    return true;
  }

  if (
    board.get(goSouthEast(coordinate)) &&
    availableRings.includes(goSouthEast(goSouthEast(coordinate)))
  ) {
    return true;
  }

  if (
    board.get(goSouthWest(coordinate)) &&
    availableRings.includes(goSouthWest(goSouthWest(coordinate)))
  ) {
    return true;
  }

  if (
    board.get(goWest(coordinate)) &&
    availableRings.includes(goWest(goWest(coordinate)))
  ) {
    return true;
  }

  if (
    board.get(goNorthWest(coordinate)) &&
    availableRings.includes(goNorthWest(goNorthWest(coordinate)))
  ) {
    return true;
  }

  return false;
}

export function canRemoveAnyRing(availableRings, gameBoardState) {
  return Boolean(
    availableRings.find(coordinate => {
      return canRemoveRing(coordinate, availableRings, gameBoardState);
    })
  );
}

export function canRemoveRing(coordinate, availableRings, gameBoardState) {
  if (!availableRings.includes(coordinate)) {
    return false;
  }
  if (gameBoardState.get(coordinate)) {
    return false;
  }

  // Adjacent movement checks

  if (
    !availableRings.includes(goNorthEast(coordinate)) &&
    !availableRings.includes(goEast(coordinate))
  ) {
    return true;
  }

  if (
    !availableRings.includes(goEast(coordinate)) &&
    !availableRings.includes(goSouthEast(coordinate))
  ) {
    return true;
  }

  if (
    !availableRings.includes(goSouthEast(coordinate)) &&
    !availableRings.includes(goSouthWest(coordinate))
  ) {
    return true;
  }
  if (
    !availableRings.includes(goSouthWest(coordinate)) &&
    !availableRings.includes(goWest(coordinate))
  ) {
    return true;
  }
  if (
    !availableRings.includes(goWest(coordinate)) &&
    !availableRings.includes(goNorthWest(coordinate))
  ) {
    return true;
  }
  if (
    !availableRings.includes(goNorthWest(coordinate)) &&
    !availableRings.includes(goNorthEast(coordinate))
  ) {
    return true;
  }

  return false;
}

export function getAdjacentCoordinates(coordinate) {
  return List([
    goNorthWest(coordinate),
    goNorthEast(coordinate),
    goEast(coordinate),
    goSouthEast(coordinate),
    goSouthWest(coordinate),
    goWest(coordinate)
  ]);
}

function isEmptyRing(gameState, coordinate) {
  return (
    gameState.get("availableRings").includes(coordinate) &&
    !gameState.get("board").get(coordinate)
  );
}

function isMarble(gameState, coordinate) {
  return gameState.get("board").get(coordinate);
}

// Recursive function needs coordinatesToIgnore to not loop infinitely
export function isGroupIsolated(gameState, coordinatesToIgnore = List()) {
  const startingPoints = gameState.get("board").keySeq();

  const isolatedGroup = startingPoints.forEach(coordinate => {
    const adjacentCoordinates = getAdjacentCoordinates(coordinate);
    const adjacentEmptyRings = adjacentCoordinates.filter(adjCoord => {
      return isEmptyRing(gameState, adjCoord);
    });

    // empty ring adjacent to marble (BAIL)
    if (adjacentEmptyRings.size) {
      return;
    }

    const adjacentMarbles = adjacentCoordinates
      .filter(adjCoord => {
        return coordinatesToIgnore.includes(adjCoord);
      })
      .filter(adjCoord => {
        return isMarble(gameState, adjCoord);
      });

    // marble adjacent, need to check that marbles surrounding rings
    if (adjacentMarbles.size) {
      // recursive call
      isGroupIsolated(gameState, coordinatesToIgnore.push(coordinate));
    }

    // At this point we know we have an isolate group

    debugger;
    return true;
  });
}
