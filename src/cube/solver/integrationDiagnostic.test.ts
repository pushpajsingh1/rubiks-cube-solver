import { describe, expect, it } from "vitest"
import {
  applyMove,
  type Move,
} from "../notation"
import {
  coordinatesToCube,
} from "./coordinates"
import {
  solvedCoordinates,
} from "./moveTables"
import {
  solvePhase1,
} from "./phase1"
import {
  solvePhase2,
} from "./phase2"

function scrambleCube(
  moves: Move[],
) {
  let cube =
    coordinatesToCube(
      solvedCoordinates(),
    )

  for (const move of moves) {
    cube = applyMove(
      cube,
      move,
    )
  }

  return cube
}

describe("solver integration diagnostic", () => {
  it("measures Phase 1 and Phase 2 separately", () => {
    const cube = scrambleCube([
      "R",
    ])

    console.time("Phase 1")

    const phase1 =
      solvePhase1(cube, 12)

    console.timeEnd("Phase 1")

    console.log(
      "Phase 1 result:",
      phase1,
    )

    expect(phase1.found).toBe(true)

    let phase1Cube = cube

    for (const move of phase1.moves) {
      phase1Cube =
        applyMove(
          phase1Cube,
          move,
        )
    }

    console.time("Phase 2")

    const phase2 =
      solvePhase2(
        phase1Cube,
        20,
      )

    console.timeEnd("Phase 2")

    console.log(
      "Phase 2 result:",
      phase2,
    )

    expect(phase2.found).toBe(true)
  })
})