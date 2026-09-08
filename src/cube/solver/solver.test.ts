import { describe, expect, it } from "vitest"
import { createSolvedCube } from "../CubeState"
import {
  applyMove,
  inverseSequence,
  type Move,
} from "../notation"
import { moveR } from "../moves"
import { solveCube } from "./solver"

describe("Search solver", () => {
  it("should recognize a solved cube", () => {
    const cube = createSolvedCube()

    const result = solveCube(cube)

    expect(result.solved).toBe(true)
    expect(result.moves).toEqual([])
  })

  it("should solve a one-move scramble", () => {
    const cube = moveR(createSolvedCube())

    const result = solveCube(cube, 1)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(1)
  })

  it("should solve a two-move scramble", () => {
    let cube = createSolvedCube()

    cube = applyMove(cube, "R")
    cube = applyMove(cube, "U")

    const result = solveCube(cube, 2)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(2)
  })

  it("should solve a three-move scramble", () => {
    let cube = createSolvedCube()

    const scramble: Move[] = [
      "R",
      "U",
      "F",
    ]

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 3)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(3)
  })

  it("should solve using the returned solution", () => {
    let cube = createSolvedCube()

    const scramble: Move[] = [
      "R",
      "U",
      "F",
    ]

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 3)

    expect(result.solved).toBe(true)

    for (const move of result.moves) {
      cube = applyMove(cube, move)
    }

    expect(cube).toEqual(createSolvedCube())
  })

  it("should solve a scramble within the requested depth", () => {
    let cube = createSolvedCube()

    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
    ]

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 4)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(4)
  })

  it("should return unsolved when the depth is insufficient", () => {
    let cube = createSolvedCube()

    cube = applyMove(cube, "R")
    cube = applyMove(cube, "U")

    const result = solveCube(cube, 1)

    expect(result.solved).toBe(false)
    expect(result.moves).toEqual([])
  })

  it("should produce a valid solution", () => {
    let cube = createSolvedCube()

    const scramble: Move[] = [
      "R",
      "U",
      "F",
    ]

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 3)

    expect(result.solved).toBe(true)

    const solution = result.moves

    cube = createSolvedCube()

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    for (const move of solution) {
      cube = applyMove(cube, move)
    }

    expect(cube).toEqual(createSolvedCube())

    expect(
      inverseSequence(solution).length,
    ).toBe(solution.length)
  })

  it("should solve a longer scramble within the requested depth", () => {
    let cube = createSolvedCube()

    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
    ]

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 5)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(5)

    for (const move of result.moves) {
      cube = applyMove(cube, move)
    }

    expect(cube).toEqual(createSolvedCube())
  })
})
describe("IDA* long scramble tests", () => {
  it("solves a 10-move scramble", () => {
    const scramble: Move[] = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
      "R",
      "F'",
      "U2",
      "L",
      "D",
    ]

    let cube = createSolvedCube()

    for (const move of scramble) {
      cube = applyMove(cube, move)
    }

    const result = solveCube(cube, 20)

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(20)
  })
})