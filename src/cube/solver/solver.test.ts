import { describe, expect, it } from "vitest"
import { createSolvedCube } from "../CubeState"
import {
  applySequence,
  inverseSequence,
} from "../notation"
import { solveCube } from "./solver"

describe("Search solver", () => {
  it("should recognize a solved cube", () => {
    const cube = createSolvedCube()

    const result = solveCube(cube)

    expect(result.solved).toBe(true)
    expect(result.moves).toEqual([])
  })

  it("should solve a one-move scramble", () => {
    const solved = createSolvedCube()

    const scrambled = applySequence(
      solved,
      ["R"],
    )

    const result = solveCube(scrambled)

    expect(result.solved).toBe(true)

    const finalCube = applySequence(
      scrambled,
      result.moves,
    )

    expect(finalCube).toEqual(solved)
  })

  it("should solve a two-move scramble", () => {
    const solved = createSolvedCube()

    const scrambled = applySequence(
      solved,
      ["R", "U"],
    )

    const result = solveCube(scrambled)

    expect(result.solved).toBe(true)

    const finalCube = applySequence(
      scrambled,
      result.moves,
    )

    expect(finalCube).toEqual(solved)
  })

  it("should solve a three-move scramble", () => {
    const solved = createSolvedCube()

    const scramble = [
      "R",
      "U",
      "F",
    ] as const

    const scrambled = applySequence(
      solved,
      [...scramble],
    )

    const result = solveCube(scrambled)

    expect(result.solved).toBe(true)

    const finalCube = applySequence(
      scrambled,
      result.moves,
    )

    expect(finalCube).toEqual(solved)
  })

  it("should solve using the returned solution", () => {
    const solved = createSolvedCube()

    const scramble = [
      "R",
      "U",
      "F",
    ] as const

    const scrambled = applySequence(
      solved,
      [...scramble],
    )

    const result = solveCube(scrambled)

    expect(result.solved).toBe(true)

    const solution = result.moves

    const finalCube = applySequence(
      scrambled,
      solution,
    )

    expect(finalCube).toEqual(solved)
  })

  it("should solve a scramble within the requested depth", () => {
    const solved = createSolvedCube()

    const scramble = [
      "R",
      "U",
      "F",
      "L",
    ] as const

    const scrambled = applySequence(
      solved,
      [...scramble],
    )

    const result = solveCube(
      scrambled,
      4,
    )

    expect(result.solved).toBe(true)
    expect(result.moves.length).toBeLessThanOrEqual(4)

    const finalCube = applySequence(
      scrambled,
      result.moves,
    )

    expect(finalCube).toEqual(solved)
  })

  it("should return unsolved when the depth is insufficient", () => {
    const solved = createSolvedCube()

    const scrambled = applySequence(
      solved,
      ["R", "U", "F", "L"],
    )

    const result = solveCube(
      scrambled,
      1,
    )

    expect(result.solved).toBe(false)
    expect(result.moves).toEqual([])
  })

  it("should produce a valid solution", () => {
    const solved = createSolvedCube()

    const scramble = [
      "R",
      "U",
      "F",
    ] as const

    const scrambled = applySequence(
      solved,
      [...scramble],
    )

    const result = solveCube(scrambled)

    expect(result.solved).toBe(true)

    const expectedInverse = inverseSequence(
      [...scramble],
    )

    const resultCube = applySequence(
      scrambled,
      result.moves,
    )

    const inverseCube = applySequence(
      scrambled,
      expectedInverse,
    )

    expect(resultCube).toEqual(inverseCube)
    expect(resultCube).toEqual(solved)
  })
})