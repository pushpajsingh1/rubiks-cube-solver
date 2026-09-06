import { describe, it } from "vitest"
import { createSolvedCube } from "./CubeState"
import {
  moveU,
  moveUPrime,
  moveU2,
  moveR,
  moveRPrime,
  moveR2,
  moveF,
  moveFPrime,
  moveF2,
  moveL,
  moveLPrime,
  moveL2,
  moveD,
  moveDPrime,
  moveD2,
  moveB,
  moveBPrime,
  moveB2,
} from "./moves"
import { inverseSequence } from "./notation"
import type { CubeState } from "./CubeState"

type MoveFunction = (cube: CubeState) => CubeState

const moves: Record<string, MoveFunction> = {
  U: moveU,
  "U'": moveUPrime,
  U2: moveU2,

  R: moveR,
  "R'": moveRPrime,
  R2: moveR2,

  F: moveF,
  "F'": moveFPrime,
  F2: moveF2,

  L: moveL,
  "L'": moveLPrime,
  L2: moveL2,

  D: moveD,
  "D'": moveDPrime,
  D2: moveD2,

  B: moveB,
  "B'": moveBPrime,
  B2: moveB2,
}

const moveNames = Object.keys(moves)

describe("Cube move reversibility", () => {
  for (const firstMove of moveNames) {
    for (const secondMove of moveNames) {
      it(`${firstMove} ${secondMove} should reverse correctly`, () => {
        const solved = createSolvedCube()

        let cube = createSolvedCube()

        cube = moves[firstMove](cube)
        cube = moves[secondMove](cube)

        const solution = inverseSequence([
          firstMove,
          secondMove,
        ])

        for (const move of solution) {
          cube = moves[move](cube)
        }

        if (JSON.stringify(cube) !== JSON.stringify(solved)) {
            throw new Error(`FAILED: ${firstMove} ${secondMove}`)
        }
      })
    }
  }
})