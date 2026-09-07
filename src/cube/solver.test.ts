import { describe, expect, it } from "vitest"
import { createSolvedCube } from "./CubeState"
import { applyMove, applySequence, inverseSequence } from "./notation"

describe("Move notation", () => {
  it("should apply a single move", () => {
    const solved = createSolvedCube()

    const scrambled = applyMove(solved, "R")

    expect(scrambled).not.toEqual(solved)
  })

  it("should apply a move and its inverse", () => {
    const solved = createSolvedCube()

    const cube = applySequence(solved, ["R", "R'"])

    expect(cube).toEqual(solved)
  })

  it("should apply a double move twice and return to solved", () => {
    const solved = createSolvedCube()

    const cube = applySequence(solved, ["R2", "R2"])

    expect(cube).toEqual(solved)
  })

  it("should apply a sequence in order", () => {
    const solved = createSolvedCube()

    const cube = applySequence(solved, [
      "R",
      "U",
      "F",
    ])

    expect(cube).not.toEqual(solved)
  })

  it("should solve a scramble using its inverse sequence", () => {
    const solved = createSolvedCube()

    const scramble = [
      "R",
      "U",
      "F",
      "L",
      "D",
      "B",
    ]

    const scrambled = applySequence(solved, scramble)

    const solution = inverseSequence(scramble)

    const result = applySequence(scrambled, solution)

    expect(result).toEqual(solved)
  })

  it("should reject an invalid move", () => {
    const solved = createSolvedCube()

    expect(() => applyMove(solved, "X")).toThrow()
  })
})