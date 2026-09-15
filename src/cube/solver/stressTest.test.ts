import { describe, expect, it } from "vitest"
import type { CubeState } from "../CubeState"
import { applyMove, type Move } from "../notation"
import { solveCube } from "./solver"

function scrambleCube(moves: Move[]): CubeState {
  let cube: CubeState = {
    U: Array(9).fill("white"),
    R: Array(9).fill("red"),
    F: Array(9).fill("green"),
    D: Array(9).fill("yellow"),
    L: Array(9).fill("orange"),
    B: Array(9).fill("blue"),
  }

  for (const move of moves) {
    cube = applyMove(cube, move)
  }

  return cube
}

function isSolved(cube: CubeState): boolean {
  return Object.values(cube).every((face) => {
    const center = face[4]
    return face.every((sticker) => sticker === center)
  })
}

const SCRAMBLES: {
  name: string
  moves: Move[]
}[] = [
  {
    name: "10 moves",
    moves: [
      "R", "U", "R'", "U'",
      "F", "R", "F'", "U2",
      "L", "D",
    ],
  },
  {
    name: "20 moves",
    moves: [
      "R", "U", "R'", "U'",
      "F", "R", "F'", "U2",
      "L", "D", "B", "R2",
      "U'", "F2", "D'", "L2",
      "B'", "R", "U2", "F'",
    ],
  },
  {
    name: "25 moves",
    moves: [
      "R", "U", "F", "R'", "D",
      "L2", "B", "U'", "R2", "F'",
      "D2", "L", "B'", "U2", "R",
      "F2", "D'", "L'", "B2", "U",
      "R'", "F", "D", "L2", "B'",
    ],
  },
  {
    name: "30 moves",
    moves: [
      "R", "U", "F", "R'", "D",
      "L2", "B", "U'", "R2", "F'",
      "D2", "L", "B'", "U2", "R",
      "F2", "D'", "L'", "B2", "U",
      "R'", "F", "D", "L2", "B'",
      "U", "R2", "F'", "D2", "L",
    ],
  },
  {
    name: "35 moves",
    moves: [
      "R", "U", "F", "R'", "D",
      "L2", "B", "U'", "R2", "F'",
      "D2", "L", "B'", "U2", "R",
      "F2", "D'", "L'", "B2", "U",
      "R'", "F", "D", "L2", "B'",
      "U", "R2", "F'", "D2", "L",
      "B2", "U'", "F", "R", "D'",
    ],
  },
]

describe("Long scramble stress test", () => {
  for (const scramble of SCRAMBLES) {
    it(`should solve the ${scramble.name} scramble`, () => {
      const cube = scrambleCube(scramble.moves)

      const start = performance.now()

      const result = solveCube(cube, 30)

      const elapsed = performance.now() - start

      console.log(
        `${scramble.name}:`,
        `${elapsed.toFixed(2)}ms`,
        `solution=${result.moves.length} moves`,
      )

      expect(result.solved).toBe(true)

      const solvedCube = scrambleCube([
        ...scramble.moves,
        ...result.moves,
      ])

      expect(isSolved(solvedCube)).toBe(true)
    })
  }
})