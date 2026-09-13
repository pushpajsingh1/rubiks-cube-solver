import { describe, expect, it } from "vitest"
import {
  decodeCornerPermutation,
  decodeUDEdgePermutation,
  decodeESlicePermutation,
  encodeCornerPermutation,
  encodeUDEdgePermutation,
  encodeESlicePermutation,
} from "./coordinateEncoding"
import {
  ensurePhase2MoveTables,
  cornerPermutationMoveTable,
  udEdgePermutationMoveTable,
  eSlicePermutationMoveTable,
  CORNER_PERMUTATION_COUNT,
  UD_EDGE_PERMUTATION_COUNT,
  ESLICE_PERMUTATION_COUNT,
  PHASE2_MOVE_COUNT,
} from "./phase2MoveTables"
import {
  applyCoordinateMove,
  solvedCoordinates,
} from "./moveTables"
import {
  PHASE2_MOVE_INDICES,
} from "./phase2Moves"

describe("Phase 2 move tables", () => {
  it("should have the expected sizes", () => {
    ensurePhase2MoveTables()

    expect(
      cornerPermutationMoveTable.length,
    ).toBe(
      CORNER_PERMUTATION_COUNT *
        PHASE2_MOVE_COUNT,
    )

    expect(
      udEdgePermutationMoveTable.length,
    ).toBe(
      UD_EDGE_PERMUTATION_COUNT *
        PHASE2_MOVE_COUNT,
    )

    expect(
      eSlicePermutationMoveTable.length,
    ).toBe(
      ESLICE_PERMUTATION_COUNT *
        PHASE2_MOVE_COUNT,
    )
  })

  it("should round-trip corner permutations", () => {
    const samples = [
      0,
      1,
      42,
      1234,
      20160,
      40319,
    ]

    for (const index of samples) {
      expect(
        encodeCornerPermutation(
          {
            ...solvedCoordinates(),
            cornerPermutation:
              decodeCornerPermutation(index),
          },
        ),
      ).toBe(index)
    }
  })

  it("should round-trip U/D edge permutations", () => {
    const samples = [
      0,
      1,
      42,
      1234,
      20160,
      40319,
    ]

    for (const index of samples) {
      expect(
        encodeUDEdgePermutation(
          {
            ...solvedCoordinates(),
            edgePermutation:
              decodeUDEdgePermutation(index),
          },
        ),
      ).toBe(index)
    }
  })

  it("should round-trip E-slice permutations", () => {
    const samples = [
      0,
      1,
      5,
      12,
      23,
    ]

    for (const index of samples) {
      expect(
        encodeESlicePermutation(
          {
            ...solvedCoordinates(),
            edgePermutation:
              decodeESlicePermutation(index),
          },
        ),
      ).toBe(index)
    }
  })

  it("should preserve solved coordinates", () => {
    ensurePhase2MoveTables()

    const solved =
      solvedCoordinates()

    expect(
      encodeCornerPermutation(
        solved,
      ),
    ).toBe(0)

    expect(
      encodeUDEdgePermutation(
        solved,
      ),
    ).toBe(0)

    expect(
      encodeESlicePermutation(
        solved,
      ),
    ).toBe(0)
  })

  it("should produce valid phase 2 coordinates", () => {
    ensurePhase2MoveTables()

    const solved =
      solvedCoordinates()

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const next =
        applyCoordinateMove(
          solved,
          PHASE2_MOVE_INDICES[move],
        )

      expect(
        next.cornerOrientation.every(
          (value) => value === 0,
        ),
      ).toBe(true)

      expect(
        next.edgeOrientation.every(
          (value) => value === 0,
        ),
      ).toBe(true)

      expect(
        next.edgePermutation.filter(
          (piece) => piece >= 8,
        ),
      ).toHaveLength(4)
    }
  })
})