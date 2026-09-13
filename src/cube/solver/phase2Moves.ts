import type { Move } from "../notation"

export const PHASE2_MOVES: Move[] = [
  "U",
  "U'",
  "U2",
  "D",
  "D'",
  "D2",
  "R2",
  "L2",
  "F2",
  "B2",
]

export const PHASE2_MOVE_INDICES: number[] =
  PHASE2_MOVES.map((move) => {
    const index = [
      "U", "U'", "U2",
      "R", "R'", "R2",
      "F", "F'", "F2",
      "L", "L'", "L2",
      "D", "D'", "D2",
      "B", "B'", "B2",
    ].indexOf(move)

    if (index === -1) {
      throw new Error(
        `Invalid phase 2 move: ${move}`,
      )
    }

    return index
  })