import { describe, expect, it } from "vitest"
import { createSolvedCube } from "./CubeState"
import { applyMove, inverseMove, type Move } from "./notation"

const MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

describe("real-cube move consistency", () => {
  it("every move followed by its inverse restores a scrambled cube", () => {
    let cube = createSolvedCube()

    for (const move of ["R", "U", "F", "L", "D", "B"] as Move[]) {
      cube = applyMove(cube, move)
    }

    for (const move of MOVES) {
      const after = applyMove(
        applyMove(cube, move),
        inverseMove(move),
      )

      expect(after).toEqual(cube)
    }
  })
})
