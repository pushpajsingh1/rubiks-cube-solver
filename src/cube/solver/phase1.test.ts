import {
  describe,
  expect,
  it,
} from "vitest"

import {
  createSolvedCube,
} from "../CubeState"

import {
  applySequence,
} from "../notation"

import {
  solvePhase1,
} from "./phase1"

import {
  cubeToCoordinates,
} from "./coordinates"

import {
  encodeCornerOrientation,
  encodeEdgeOrientation,
  encodeESlice,
} from "./coordinateEncoding"

describe("phase 1 solver", () => {
  it("recognizes a solved cube", () => {
    const cube =
      createSolvedCube()

    const result =
      solvePhase1(cube)

    expect(result.found).toBe(true)
    expect(result.moves).toEqual([])
    expect(result.depth).toBe(0)
  })

  it("solves a single move", () => {
    const cube =
      applySequence(
        createSolvedCube(),
        ["R"],
      )

    const result =
      solvePhase1(cube)

    expect(result.found).toBe(true)
    expect(result.depth).toBeLessThanOrEqual(12)
  })

  it("solves a short scramble", () => {
    const scramble = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
    ] as const

    const cube =
      applySequence(
        createSolvedCube(),
        [...scramble],
      )

    const result =
      solvePhase1(cube)

    expect(result.found).toBe(true)
    expect(result.depth).toBeLessThanOrEqual(12)
  })

  it("returns a phase-1 solved state", () => {
    const scramble = [
      "R",
      "U",
      "R'",
      "U'",
      "F",
      "R",
      "F'",
      "U2",
    ] as const

    const cube =
      applySequence(
        createSolvedCube(),
        [...scramble],
      )

    const result =
      solvePhase1(cube)

    expect(result.found).toBe(true)

    const phase1Cube =
      applySequence(
        cube,
        result.moves,
      )

    const coordinates =
      cubeToCoordinates(
        phase1Cube,
      )

    expect(
      encodeCornerOrientation(
        coordinates,
      ),
    ).toBe(0)

    expect(
      encodeEdgeOrientation(
        coordinates,
      ),
    ).toBe(0)

    expect(
      encodeESlice(
        coordinates,
      ),
    ).toBe(0)
  })

  it("does not exceed the requested maximum depth", () => {
    const cube =
      applySequence(
        createSolvedCube(),
        [
          "R",
          "U",
          "R'",
          "U'",
        ],
      )

    const result =
      solvePhase1(cube, 2)

    if (result.found) {
      expect(
        result.depth,
      ).toBeLessThanOrEqual(2)
    }
  })
})