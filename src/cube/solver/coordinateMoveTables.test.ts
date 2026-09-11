import { describe, expect, it } from "vitest"
import {
  CORNER_ORIENTATION_COUNT,
  EDGE_ORIENTATION_COUNT,
  ESLICE_COUNT,
  MOVE_COUNT,
  CORNER_ORIENTATION_MOVE_TABLE,
  EDGE_ORIENTATION_MOVE_TABLE,
  ESLICE_MOVE_TABLE,
  nextCornerOrientation,
  nextEdgeOrientation,
  nextESlice,
} from "./coordinateMoveTables"
import {
  applyCoordinateMove,
  SOLVER_MOVES,
  solvedCoordinates,
} from "./moveTables"
import {
  decodeCornerOrientation,
  decodeESliceEdgePermutation,
  encodeCornerOrientation,
  encodeESlice,
  encodeEdgeOrientation,
} from "./coordinateEncoding"

describe("coordinate move tables", () => {
  it("has the expected sizes", () => {
    expect(
      CORNER_ORIENTATION_MOVE_TABLE.length,
    ).toBe(
      CORNER_ORIENTATION_COUNT *
        MOVE_COUNT,
    )

    expect(
      EDGE_ORIENTATION_MOVE_TABLE.length,
    ).toBe(
      EDGE_ORIENTATION_COUNT *
        MOVE_COUNT,
    )

    expect(
      ESLICE_MOVE_TABLE.length,
    ).toBe(
      ESLICE_COUNT *
        MOVE_COUNT,
    )
  })

  it("keeps solved coordinates solved under the identity of double inverse moves", () => {
    const solved = solvedCoordinates()

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const move = SOLVER_MOVES[moveIndex]

      const once = applyCoordinateMove(
        solved,
        moveIndex,
      )

      const inverseIndex =
        SOLVER_MOVES.indexOf(
          move.endsWith("2")
            ? move
            : move.endsWith("'")
              ? move.slice(0, -1)
              : `${move}'`,
        )

      expect(inverseIndex).toBeGreaterThanOrEqual(
        0,
      )

      const restored =
        applyCoordinateMove(
          once,
          inverseIndex,
        )

      expect(restored).toEqual(
        solved,
      )
    }
  })

  it("matches corner-orientation transitions", () => {
    for (
      let coordinate = 0;
      coordinate < CORNER_ORIENTATION_COUNT;
      coordinate++
    ) {
      const coordinates =
        solvedCoordinates()

      coordinates.cornerOrientation =
        decodeCornerOrientation(
          coordinate,
        )

      for (
        let moveIndex = 0;
        moveIndex < MOVE_COUNT;
        moveIndex++
      ) {
        const expected =
          encodeCornerOrientation(
            applyCoordinateMove(
              coordinates,
              moveIndex,
            ),
          )

        expect(
          nextCornerOrientation(
            coordinate,
            moveIndex,
          ),
        ).toBe(expected)
      }
    }
  })

  it("matches edge-orientation transitions", () => {
    for (
      let coordinate = 0;
      coordinate < EDGE_ORIENTATION_COUNT;
      coordinate++
    ) {
      const orientation = Array(12).fill(0)
      let remaining = coordinate

      for (
        let position = 10;
        position >= 0;
        position--
      ) {
        orientation[position] =
          remaining % 2

        remaining = Math.floor(
          remaining / 2,
        )
      }

      const sum = orientation
        .slice(0, 11)
        .reduce(
          (total, value) =>
            total + value,
          0,
        )

      orientation[11] = sum % 2

      const coordinates =
        solvedCoordinates()

      coordinates.edgeOrientation =
        orientation

      for (
        let moveIndex = 0;
        moveIndex < MOVE_COUNT;
        moveIndex++
      ) {
        const expected =
          encodeEdgeOrientation(
            applyCoordinateMove(
              coordinates,
              moveIndex,
            ),
          )

        expect(
          nextEdgeOrientation(
            coordinate,
            moveIndex,
          ),
        ).toBe(expected)
      }
    }
  })

  it("matches E-slice transitions", () => {
    for (
      let coordinate = 0;
      coordinate < ESLICE_COUNT;
      coordinate++
    ) {
      const coordinates =
        solvedCoordinates()

      coordinates.edgePermutation =
        decodeESliceEdgePermutation(
          coordinate,
        )

      for (
        let moveIndex = 0;
        moveIndex < MOVE_COUNT;
        moveIndex++
      ) {
        const expected =
          encodeESlice(
            applyCoordinateMove(
              coordinates,
              moveIndex,
            ),
          )

        expect(
          nextESlice(
            coordinate,
            moveIndex,
          ),
        ).toBe(expected)
      }
    }
  })

  it("has solved transitions for the inverse move pairs", () => {
    const solved = solvedCoordinates()

    for (
      let moveIndex = 0;
      moveIndex < MOVE_COUNT;
      moveIndex++
    ) {
      const move = SOLVER_MOVES[moveIndex]

      const inverse =
        move.endsWith("2")
          ? move
          : move.endsWith("'")
            ? move.slice(0, -1)
            : `${move}'`

      const inverseIndex =
        SOLVER_MOVES.indexOf(
          inverse,
        )

      const afterMove =
        applyCoordinateMove(
          solved,
          moveIndex,
        )

      const restored =
        applyCoordinateMove(
          afterMove,
          inverseIndex,
        )

      expect(restored).toEqual(
        solved,
      )
    }
  })
})