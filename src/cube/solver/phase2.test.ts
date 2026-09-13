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
  solvePhase2,
} from "./phase2"

function applyMoves(
  moves: Move[],
) {
  let cube =
    coordinatesToCube(
      solvedCoordinates(),
    )

  for (const move of moves) {
    cube = applyMove(cube, move)
  }

  return cube
}

function applySolution(
  cube: ReturnType<typeof coordinatesToCube>,
  moves: Move[],
) {
  let current = cube

  for (const move of moves) {
    current = applyMove(
      current,
      move,
    )
  }

  return current
}

function expectSolved(
  cube: ReturnType<typeof coordinatesToCube>,
) {
  expect(cube).toEqual(
    coordinatesToCube(
      solvedCoordinates(),
    ),
  )
}

describe("Phase 2 solver", () => {
  it("should recognize a solved cube", () => {
    const cube =
      coordinatesToCube(
        solvedCoordinates(),
      )

    const result =
      solvePhase2(cube)

    expect(result.found).toBe(true)
    expect(result.moves).toEqual([])
    expect(result.depth).toBe(0)
  })

  it("should solve a single phase 2 move", () => {
    const moves: Move[] = [
      "R2",
    ]

    const cube =
      applyMoves(moves)

    const result =
      solvePhase2(cube)

    expect(result.found).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve every individual phase 2 move", () => {
    const moves: Move[] = [
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

    for (const move of moves) {
      const cube =
        applyMoves([move])

      const result =
        solvePhase2(cube, 20)

      expect(
        result.found,
        `failed to solve ${move}`,
      ).toBe(true)

      expectSolved(
        applySolution(
          cube,
          result.moves,
        ),
      )
    }
  })

  it("should solve a short phase 2 scramble", () => {
    const scramble: Move[] = [
      "R2",
      "U",
      "F2",
      "D'",
      "L2",
      "B2",
    ]

    const cube =
      applyMoves(scramble)

    const result =
      solvePhase2(cube, 20)

    expect(result.found).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a medium phase 2 scramble", () => {
    const scramble: Move[] = [
      "R2",
      "U",
      "F2",
      "D'",
      "L2",
      "B2",
      "U'",
      "R2",
      "D2",
      "F2",
      "L2",
      "U2",
    ]

    const cube =
      applyMoves(scramble)

    const result =
      solvePhase2(cube, 20)

    expect(result.found).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })

  it("should solve a longer phase 2 scramble", () => {
    const scramble: Move[] = [
      "R2",
      "U",
      "F2",
      "D'",
      "L2",
      "B2",
      "U'",
      "R2",
      "D2",
      "F2",
      "L2",
      "U2",
      "B2",
      "D",
      "R2",
      "F2",
    ]

    const cube =
      applyMoves(scramble)

    const result =
      solvePhase2(cube, 20)

    expect(result.found).toBe(true)

    expectSolved(
      applySolution(
        cube,
        result.moves,
      ),
    )
  })
})