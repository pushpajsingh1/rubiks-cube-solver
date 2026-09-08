import { describe, it } from "vitest"

import { createSolvedCube } from "../CubeState"
import { applyMove, type Move } from "../notation"
import { cubeToCoordinates } from "./coordinates"

const MOVES: Move[] = [
  "U",
  "U'",
  "U2",
  "R",
  "R'",
  "R2",
  "F",
  "F'",
  "F2",
  "L",
  "L'",
  "L2",
  "D",
  "D'",
  "D2",
  "B",
  "B'",
  "B2",
]

describe("coordinate diagnostic", () => {
  it("finds the first move that breaks cubie mapping", () => {
    for (const move of MOVES) {
      const cube = applyMove(
        createSolvedCube(),
        move,
      )

      try {
        const coordinates =
          cubeToCoordinates(cube)

        console.log(
          `PASS ${move}`,
          coordinates,
        )
      } catch (error) {
        console.log(`FAIL ${move}`)

        console.log(
          error instanceof Error
            ? error.message
            : error,
        )

        throw error
      }
    }
  })

  it("finds the first move in a sequence that breaks mapping", () => {
    const sequence: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
      "R",
      "F'",
      "U2",
    ]

    let cube = createSolvedCube()

    for (const move of sequence) {
      cube = applyMove(cube, move)

      try {
        cubeToCoordinates(cube)

        console.log(`PASS after ${move}`)
      } catch (error) {
        console.log(`FAIL after ${move}`)

        console.log(
          error instanceof Error
            ? error.message
            : error,
        )

        throw error
      }
    }
  })
})