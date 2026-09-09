import {
  describe,
  expect,
  it,
} from "vitest"

import {
  encodeCornerOrientation,
  encodeEdgeOrientation,
  encodeESlice,
  encodeCornerPermutation,
  encodeUDEdgePermutation,
  encodeESlicePermutation,
} from "./coordinateEncoding"

import {
  applyMovesToCoordinates,
} from "./coordinates"

import {
  solvedCoordinates,
} from "./moveTables"

import {
  createSolvedCube,
} from "../CubeState"

describe("coordinate encoding", () => {
  it("should encode the solved state", () => {
    const coordinates = solvedCoordinates()

    expect(
      encodeCornerOrientation(coordinates),
    ).toBe(0)

    expect(
      encodeEdgeOrientation(coordinates),
    ).toBe(0)

    expect(
      encodeESlice(coordinates),
    ).toBe(0)

    expect(
      encodeCornerPermutation(coordinates),
    ).toBe(0)

    expect(
      encodeUDEdgePermutation(coordinates),
    ).toBe(0)

    expect(
      encodeESlicePermutation(coordinates),
    ).toBe(0)
  })

  it("should produce valid ranges", () => {
    const scrambles = [
      ["R"],
      ["R", "U", "F"],
      [
        "R",
        "U",
        "R'",
        "U'",
        "F",
        "R",
        "F'",
        "U2",
      ],
      [
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
        "B'",
        "R2",
      ],
    ] as const

    for (const scramble of scrambles) {
      const coordinates =
        applyMovesToCoordinates(
          createSolvedCube(),
          [...scramble],
        )

      expect(
        encodeCornerOrientation(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeCornerOrientation(coordinates),
      ).toBeLessThan(2187)

      expect(
        encodeEdgeOrientation(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeEdgeOrientation(coordinates),
      ).toBeLessThan(2048)

      expect(
        encodeESlice(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeESlice(coordinates),
      ).toBeLessThan(495)

      expect(
        encodeCornerPermutation(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeCornerPermutation(coordinates),
      ).toBeLessThan(40320)

      expect(
        encodeUDEdgePermutation(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeUDEdgePermutation(coordinates),
      ).toBeLessThan(40320)

      expect(
        encodeESlicePermutation(coordinates),
      ).toBeGreaterThanOrEqual(0)

      expect(
        encodeESlicePermutation(coordinates),
      ).toBeLessThan(24)
    }
  })

  it("should give different corner permutation coordinates", () => {
    const solved = solvedCoordinates()

    const scrambled =
      applyMovesToCoordinates(
        createSolvedCube(),
        ["R"],
      )

    expect(
      encodeCornerPermutation(scrambled),
    ).not.toBe(
      encodeCornerPermutation(solved),
    )
  })

  it("should keep solved encoding at zero", () => {
    const solved = solvedCoordinates()

    expect(
      encodeCornerPermutation(solved),
    ).toBe(0)

    expect(
      encodeUDEdgePermutation(solved),
    ).toBe(0)

    expect(
      encodeESlicePermutation(solved),
    ).toBe(0)
  })
})