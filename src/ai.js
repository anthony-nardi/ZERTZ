import { List, Map } from "immutable";
import {
  TZAAR,
  TOTT,
  TZARRA,
  PLAYER_ONE,
  PLAYER_TWO,
  CORNER_COORDINATES,
  EDGE_COORDINATES
} from "./constants";

import { currentTurn, numberOfTurnsIntoGame } from "./gameState";
import {
  getValidCaptures,
  getValidStacks,
  getInvertedValidCaptures
} from "./gameBoardHelpers";

export function minimax(
  gameState,
  turn,
  depth,
  alpha = -Infinity,
  beta = Infinity
) {
  const winner = getWinner(gameState);
  if (winner === PLAYER_ONE) {
    return [-Infinity];
  }
  if (winner === PLAYER_TWO) {
    return [Infinity];
  }

  if (depth === 0) {
    return [getGameStateScore(gameState)];
  }

  // maximizing player
  if (turn === PLAYER_TWO) {
    let bestValue = -Infinity;
    let moveSeq = null;

    // choose max score after player one makes his move
    const gameStatesToAnalyze = getGameStatesToAnalyze(gameState, PLAYER_TWO);
    gameStatesToAnalyze.forEach((nextGameState, nextMoveSeq) => {
      const [maybeBetterValue] = minimax(
        nextGameState,
        PLAYER_ONE,
        depth - 1,
        alpha,
        beta
      );
      if (maybeBetterValue >= bestValue) {
        bestValue = maybeBetterValue;
        moveSeq = nextMoveSeq;
      }

      alpha = Math.max(bestValue, alpha);

      if (alpha >= beta) {
        return false;
      }
    });

    return [bestValue, moveSeq];
  }

  // minimizing player
  if (turn === PLAYER_ONE) {
    let bestValue = Infinity;
    let moveSeq = null;
    // choose lowest score after player two makes move
    const gameStatesToAnalyze = getGameStatesToAnalyze(gameState, PLAYER_ONE);

    gameStatesToAnalyze.forEach((nextGameState, nextMoveSeq) => {
      const [maybeWorseValue] = minimax(
        nextGameState,
        PLAYER_TWO,
        depth - 1,
        alpha,
        beta
      );

      if (maybeWorseValue <= bestValue) {
        bestValue = maybeWorseValue;
        moveSeq = nextMoveSeq;
      }

      beta = Math.min(beta, bestValue);

      if (alpha >= beta) {
        return false;
      }
    });

    return [bestValue, moveSeq];
  }
}
