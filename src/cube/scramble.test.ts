import { describe, expect, it } from "vitest"
import {
  applyScramble,
  generateScramble,
} from "./scramble"
import { createSolvedCube } from "./CubeState"
import { inverseSequence } from "./notation"
import type { Move } from "./notation"

const MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

const FACE_OF: Record<Move, string> = {
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
function isSolved(cube: ReturnType<typeof createSolvedCube>) {
  return (
    cube.U.every((color) => color === "white") &&
    cube.D.every((color) => color === "yellow") &&
    cube.F.every((color) => color === "green") &&
    cube.B.every((color) => color === "blue") &&
    cube.L.every((color) => color === "orange") &&
    cube.R.every((color) => color === "red")
  )
}
describe("generateScramble", () => {
  it("generates 20 moves by default", () => {
    const scramble = generateScramble()

    expect(scramble).toHaveLength(20)
  })

  it("generates the requested number of moves", () => {
    const scramble = generateScramble(30)

    expect(scramble).toHaveLength(30)
  })

  it("generates only valid cube moves", () => {
    const scramble = generateScramble(100)

    for (const move of scramble) {
      expect(MOVES).toContain(move)
    }
  })

  it("does not repeat the same face consecutively", () => {
    const scramble = generateScramble(100)

    for (let i = 1; i < scramble.length; i++) {
      expect(
        FACE_OF[scramble[i]],
      ).not.toBe(
        FACE_OF[scramble[i - 1]],
      )
    }
  })

  it("can generate different scrambles", () => {
    const first = generateScramble(20).join(" ")
    const second = generateScramble(20).join(" ")

    expect(first).not.toBe(second)
  })
})

describe("applyScramble", () => {
  it("changes a solved cube", () => {
    const cube = createSolvedCube()
    const scramble: Move[] = [
      "R",
      "U",
      "F",
    ]

    const scrambledCube = applyScramble(
      cube,
      scramble,
    )

    expect(isSolved(scrambledCube)).toBe(false)
  })

  it("applies every scramble move legally", () => {
    const cube = createSolvedCube()
    const scramble = generateScramble(20)

    const scrambledCube = applyScramble(
      cube,
      scramble,
    )

    expect(isSolved(scrambledCube)).toBe(false)
  })

  it("can return to solved state using the inverse scramble", () => {
    const cube = createSolvedCube()
    const scramble = generateScramble(20)

    const scrambledCube = applyScramble(
      cube,
      scramble,
    )

    const restoredCube = applyScramble(
      scrambledCube,
      inverseSequence(scramble),
    )

    expect(isSolved(restoredCube)).toBe(true)
  })
})