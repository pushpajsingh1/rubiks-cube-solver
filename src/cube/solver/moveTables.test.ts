import {
  describe,
  expect,
  it,
} from "vitest"

import {
  applyCoordinateMove,
  applyCoordinateMoves,
  SOLVER_MOVES,
  solvedCoordinates,
} from "./moveTables"

import {
  applyMovesToCoordinates,
} from "./coordinates"

import { createSolvedCube } from "../CubeState"

describe("move tables", () => {
  it("should contain all 18 standard moves", () => {
    expect(SOLVER_MOVES).toHaveLength(18)

    expect(SOLVER_MOVES).toEqual([
      "U", "U'", "U2",
      "R", "R'", "R2",
      "F", "F'", "F2",
      "L", "L'", "L2",
      "D", "D'", "D2",
      "B", "B'", "B2",
    ])
  })

  it("should keep the solved coordinate state unchanged", () => {
    const solved = solvedCoordinates()

    expect(solved.cornerPermutation).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ])

    expect(solved.cornerOrientation).toEqual(
      Array(8).fill(0),
    )

    expect(solved.edgePermutation).toEqual([
      0, 1, 2, 3, 4, 5,
      6, 7, 8, 9, 10, 11,
    ])

    expect(solved.edgeOrientation).toEqual(
      Array(12).fill(0),
    )
  })

  it("should match the existing sticker move implementation", () => {
    const cube = createSolvedCube()
    const solved = solvedCoordinates()

    for (
      let moveIndex = 0;
      moveIndex < SOLVER_MOVES.length;
      moveIndex++
    ) {
      const move = SOLVER_MOVES[moveIndex]

      const fromStickerCube =
        applyMovesToCoordinates(
          cube,
          [move],
        )

      const fromCoordinateMove =
        applyCoordinateMove(
          solved,
          moveIndex,
        )

      expect(fromCoordinateMove).toEqual(
        fromStickerCube,
      )
    }
  })

  it("should return to solved after four quarter turns", () => {
    const solved = solvedCoordinates()

    const faces = [
      "U",
      "R",
      "F",
      "L",
      "D",
      "B",
    ] as const

    for (const face of faces) {
      const result =
        applyCoordinateMoves(
          solved,
          [
            face,
            face,
            face,
            face,
          ],
        )

      expect(result).toEqual(solved)
    }
  })

  it("should cancel a move with its inverse", () => {
    const solved = solvedCoordinates()

    const pairs = [
      ["U", "U'"],
      ["R", "R'"],
      ["F", "F'"],
      ["L", "L'"],
      ["D", "D'"],
      ["B", "B'"],
    ] as const

    for (const [move, inverse] of pairs) {
      const result =
        applyCoordinateMoves(
          solved,
          [move, inverse],
        )

      expect(result).toEqual(solved)
    }
  })

  it("should cancel double turns", () => {
    const solved = solvedCoordinates()

    const faces = [
      "U",
      "R",
      "F",
      "L",
      "D",
      "B",
    ] as const

    for (const face of faces) {
      const result =
        applyCoordinateMoves(
          solved,
          [face, `${face}2`, face],
        )

      expect(result).toEqual(solved)
    }
  })
    it("should match sticker moves after a scramble", () => {
    const scramble = [
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
    ] as const

    const stickerCoordinates =
      applyMovesToCoordinates(
        createSolvedCube(),
        [...scramble],
      )

    let coordinateState = solvedCoordinates()

    for (const move of scramble) {
      const moveIndex =
        SOLVER_MOVES.indexOf(move)

      expect(moveIndex).toBeGreaterThanOrEqual(0)

      coordinateState =
        applyCoordinateMove(
          coordinateState,
          moveIndex,
        )
    }

    expect(coordinateState).toEqual(
      stickerCoordinates,
    )
  })
    it("should match sticker moves across multiple sequences", () => {
    const sequences = [
      [
        "U",
        "R",
        "F",
        "L'",
        "D2",
        "B",
        "R2",
        "U'",
      ],
      [
        "F",
        "F",
        "R'",
        "D",
        "L2",
        "B'",
        "U2",
        "R",
      ],
      [
        "R",
        "U",
        "R'",
        "U'",
        "F",
        "R",
        "F'",
        "D",
        "L",
        "B2",
      ],
      [
        "B",
        "L",
        "D'",
        "R2",
        "F'",
        "U",
        "B'",
        "L2",
        "D2",
      ],
    ] as const

    for (const sequence of sequences) {
      const stickerCoordinates =
        applyMovesToCoordinates(
          createSolvedCube(),
          [...sequence],
        )

      let coordinateState =
        solvedCoordinates()

      for (const move of sequence) {
        const moveIndex =
          SOLVER_MOVES.indexOf(move)

        expect(moveIndex).toBeGreaterThanOrEqual(0)

        coordinateState =
          applyCoordinateMove(
            coordinateState,
            moveIndex,
          )
      }

      expect(coordinateState).toEqual(
        stickerCoordinates,
      )
    }
  })
})