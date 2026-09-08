import { describe, expect, it } from "vitest"

import { createSolvedCube } from "../CubeState"
import {
  applyMovesToCoordinates,
  coordinatesToCube,
  cubeToCoordinates,
} from "./coordinates"

describe("cube coordinates", () => {
  it("should convert a solved cube correctly", () => {
    const cube = createSolvedCube()

    const coordinates = cubeToCoordinates(cube)

    expect(coordinates.cornerPermutation).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ])

    expect(coordinates.cornerOrientation).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ])

    expect(coordinates.edgePermutation).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11,
    ])

    expect(coordinates.edgeOrientation).toEqual([
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ])
  })

  it("should keep a solved cube solved after conversion", () => {
    const cube = createSolvedCube()

    const coordinates = cubeToCoordinates(cube)
    const restored = coordinatesToCube(coordinates)

    expect(restored).toEqual(cube)
  })

  it("should preserve all pieces after a move", () => {
    const cube = createSolvedCube()

    const coordinates =
      applyMovesToCoordinates(cube, ["R"])

    expect(
      [...coordinates.cornerPermutation].sort(
        (a, b) => a - b,
      ),
    ).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ])

    expect(
      [...coordinates.edgePermutation].sort(
        (a, b) => a - b,
      ),
    ).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11,
    ])
  })

  it("should preserve all pieces after every basic face move", () => {
    const cube = createSolvedCube()

    const moves = [
      "U", "R", "F",
      "L", "D", "B",
    ] as const

    for (const move of moves) {
      const coordinates =
        applyMovesToCoordinates(cube, [move])

      expect(
        [...coordinates.cornerPermutation].sort(
          (a, b) => a - b,
        ),
      ).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7,
      ])

      expect(
        [...coordinates.edgePermutation].sort(
          (a, b) => a - b,
        ),
      ).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7,
        8, 9, 10, 11,
      ])
    }
  })

  it("should return to solved after move and inverse", () => {
    const cube = createSolvedCube()

    const coordinates =
      applyMovesToCoordinates(
        cube,
        ["F", "F'"],
      )

    expect(coordinates.cornerPermutation).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ])

    expect(coordinates.cornerOrientation).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ])

    expect(coordinates.edgePermutation).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
      8, 9, 10, 11,
    ])

    expect(coordinates.edgeOrientation).toEqual([
      0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ])
  })
})