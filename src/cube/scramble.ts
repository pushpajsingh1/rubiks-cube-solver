import type { CubeState } from "./CubeState"
import type { Move } from "./notation"
import { applyMove } from "./notation"

const SCRAMBLE_MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

const MOVE_FACES: Record<Move, string> = {
  U: "U",
  "U'": "U",
  U2: "U",

  R: "R",
  "R'": "R",
  R2: "R",

  F: "F",
  "F'": "F",
  F2: "F",

  L: "L",
  "L'": "L",
  L2: "L",

  D: "D",
  "D'": "D",
  D2: "D",

  B: "B",
  "B'": "B",
  B2: "B",
}

export function generateScramble(
  length = 20,
): Move[] {
  const scramble: Move[] = []

  while (scramble.length < length) {
    const move =
      SCRAMBLE_MOVES[
        Math.floor(
          Math.random() * SCRAMBLE_MOVES.length,
        )
      ]

    const previousMove =
      scramble[scramble.length - 1]

    if (
      previousMove &&
      MOVE_FACES[move] === MOVE_FACES[previousMove]
    ) {
      continue
    }

    scramble.push(move)
  }

  return scramble
}

export function applyScramble(
  cube: CubeState,
  scramble: Move[],
): CubeState {
  let result = cube

  for (const move of scramble) {
    result = applyMove(result, move)
  }

  return result
}