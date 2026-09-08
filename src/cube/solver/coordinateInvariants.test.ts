import {
  describe,
  expect,
  it,
} from "vitest"

import { createSolvedCube } from "../CubeState"
import {
  applyMovesToCoordinates,
  cubeToCoordinates,
} from "./coordinates"
import {
  applyMove,
  inverseMove,
  type Move,
} from "../notation"

const MOVES: Move[] = [
  "U", "U'", "U2",
  "R", "R'", "R2",
  "F", "F'", "F2",
  "L", "L'", "L2",
  "D", "D'", "D2",
  "B", "B'", "B2",
]

function isPermutation(
  values: number[],
  size: number,
): boolean {
  if (values.length !== size) {
    return false
  }

  const sorted = [...values].sort(
    (a, b) => a - b,
  )

  return sorted.every(
    (value, index) => value === index,
  )
}

function scramble(
  moves: Move[],
) {
  let cube = createSolvedCube()

  for (const move of moves) {
    cube = applyMove(cube, move)
  }

  return cube
}

describe("coordinate invariants", () => {
  it("should represent the solved cube", () => {
    const coordinates =
      cubeToCoordinates(
        createSolvedCube(),
      )

    expect(
      coordinates.cornerPermutation,
    ).toEqual([
      0, 1, 2, 3,
      4, 5, 6, 7,
    ])

    expect(
      coordinates.edgePermutation,
    ).toEqual([
      0, 1, 2, 3,
      4, 5, 6, 7,
      8, 9, 10, 11,
    ])

    expect(
      coordinates.cornerOrientation,
    ).toEqual(
      Array(8).fill(0),
    )

    expect(
      coordinates.edgeOrientation,
    ).toEqual(
      Array(12).fill(0),
    )
  })

  it("should keep permutations valid after every basic move", () => {
    const solved = createSolvedCube()

    for (const move of MOVES) {
      const coordinates =
        applyMovesToCoordinates(
          solved,
          [move],
        )

      expect(
        isPermutation(
          coordinates.cornerPermutation,
          8,
        ),
      ).toBe(true)

      expect(
        isPermutation(
          coordinates.edgePermutation,
          12,
        ),
      ).toBe(true)
    }
  })

  it("should keep orientations in their valid ranges", () => {
    const scrambles: Move[][] = [
      ["R"],
      ["U", "R", "F"],
      ["R", "U", "R'", "U'"],
      ["F", "R", "U", "R'", "U'", "F'"],
      [
        "R", "U", "R'", "U'",
        "F", "R", "F'", "U2",
      ],
    ]

    for (const sequence of scrambles) {
      const coordinates =
        applyMovesToCoordinates(
          createSolvedCube(),
          sequence,
        )

      expect(
        coordinates.cornerOrientation.every(
          (value) =>
            value >= 0 && value < 3,
        ),
      ).toBe(true)

      expect(
        coordinates.edgeOrientation.every(
          (value) =>
            value >= 0 && value < 2,
        ),
      ).toBe(true)
    }
  })

  it("should return the physical cube to solved after inverse", () => {
    const sequences: Move[][] = [
      ["R", "U", "R'", "U'"],
      [
        "F", "R", "U",
        "R'", "U'", "F'",
      ],
      [
        "R", "U2", "F", "L'",
        "D", "B2", "R'", "U",
      ],
    ]

    const solved = createSolvedCube()

    for (const sequence of sequences) {
      const inverse =
        [...sequence]
          .reverse()
          .map(inverseMove)

      let cube = solved

      for (const move of [
        ...sequence,
        ...inverse,
      ]) {
        cube = applyMove(cube, move)
      }

      expect(cube).toEqual(solved)
    }
  })

  it("should handle a longer legal scramble", () => {
    const sequence: Move[] = [
      "R", "U", "R'", "U'",
      "F", "R", "F'", "U2",
      "L", "D", "B'", "R2",
      "F2", "U", "L'", "D2",
      "B", "R'",
    ]

    const coordinates =
      applyMovesToCoordinates(
        createSolvedCube(),
        sequence,
      )

    expect(
      isPermutation(
        coordinates.cornerPermutation,
        8,
      ),
    ).toBe(true)

    expect(
      isPermutation(
        coordinates.edgePermutation,
        12,
      ),
    ).toBe(true)
  })
})