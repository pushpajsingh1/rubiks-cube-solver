import {
  describe,
  expect,
  it,
} from "vitest"

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
  solveCube,
} from "./solver"

function solvedCube() {
  return coordinatesToCube(
    solvedCoordinates(),
  )
}

function scrambleCube(
  scramble: Move[],
) {
  let cube =
    solvedCube()

  for (const move of scramble) {
    cube = applyMove(
      cube,
      move,
    )
  }

  return cube
}

function applySolution(
  cube: ReturnType<
    typeof solvedCube
  >,
  solution: Move[],
) {
  let current = cube

  for (const move of solution) {
    current = applyMove(
      current,
      move,
    )
  }

  return current
}

function expectSolved(
  cube: ReturnType<
    typeof solvedCube
  >,
) {
  expect(cube).toEqual(
    solvedCube(),
  )
}

describe("Two-phase solver", () => {
  it("should recognize a solved cube", () => {
    const cube =
      solvedCube()

    const result =
      solveCube(cube)

    expect(result.solved).toBe(true)
    expect(result.moves).toEqual([])
  })

  it("should solve a one-move scramble", () => {
    const cube =
      scrambleCube(["R"])

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a two-move scramble", () => {
    const cube =
      scrambleCube([
        "R",
        "U",
      ])

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a short scramble", () => {
    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
    ]

    const cube =
      scrambleCube(scramble)

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a 10-move scramble", () => {
    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
      "R",
      "U2",
      "L'",
      "D",
      "B2",
    ]

    const cube =
      scrambleCube(scramble)

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a 20-move scramble", () => {
    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
      "R",
      "U2",
      "L'",
      "D",
      "B2",
      "F'",
      "U",
      "L2",
      "D'",
      "R2",
      "B",
      "U'",
      "F2",
      "L",
      "D2",
    ]

    const cube =
      scrambleCube(scramble)

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should respect the maximum depth", () => {
    const cube =
      scrambleCube([
        "R",
        "U",
        "R'",
        "U'",
      ])

    const result =
      solveCube(cube, 1)

    expect(result.solved).toBe(false)
    expect(result.moves).toEqual([])
  })

  it("should return a valid solution", () => {
    const cube =
      scrambleCube([
        "F",
        "R",
        "U",
        "R'",
        "U'",
        "F'",
      ])

    const result =
      solveCube(cube, 30)

    expect(result.solved).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })
})