import type { CubeCoordinates } from "./coordinates"
import {
  decodeCornerPermutation,
  decodeUDEdgePermutation,
  decodeESlicePermutation,
  encodeCornerPermutation,
  encodeUDEdgePermutation,
  encodeESlicePermutation,
} from "./coordinateEncoding"
import {
  applyCoordinateMove,
  solvedCoordinates,
} from "./moveTables"
import {
  PHASE2_MOVES,
  PHASE2_MOVE_INDICES,
} from "./phase2Moves"

export const CORNER_PERMUTATION_COUNT =
  40320

export const UD_EDGE_PERMUTATION_COUNT =
  40320

export const ESLICE_PERMUTATION_COUNT =
  24

export const PHASE2_MOVE_COUNT =
  PHASE2_MOVES.length

export const cornerPermutationMoveTable =
  new Uint16Array(
    CORNER_PERMUTATION_COUNT *
      PHASE2_MOVE_COUNT,
  )

export const udEdgePermutationMoveTable =
  new Uint16Array(
    UD_EDGE_PERMUTATION_COUNT *
      PHASE2_MOVE_COUNT,
  )

export const eSlicePermutationMoveTable =
  new Uint8Array(
    ESLICE_PERMUTATION_COUNT *
      PHASE2_MOVE_COUNT,
  )

function coordinatesFromCornerPermutation(
  index: number,
): CubeCoordinates {
  const coordinates =
    solvedCoordinates()

  coordinates.cornerPermutation =
    decodeCornerPermutation(index)

  return coordinates
}

function coordinatesFromUDEdgePermutation(
  index: number,
): CubeCoordinates {
  const coordinates =
    solvedCoordinates()

  coordinates.edgePermutation =
    decodeUDEdgePermutation(index)

  return coordinates
}

function coordinatesFromESlicePermutation(
  index: number,
): CubeCoordinates {
  const coordinates =
    solvedCoordinates()

  coordinates.edgePermutation =
    decodeESlicePermutation(index)

  return coordinates
}

function buildCornerPermutationTable() {
  for (
    let coordinate = 0;
    coordinate <
    CORNER_PERMUTATION_COUNT;
    coordinate++
  ) {
    const state =
      coordinatesFromCornerPermutation(
        coordinate,
      )

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const next =
        applyCoordinateMove(
          state,
          PHASE2_MOVE_INDICES[move],
        )

      cornerPermutationMoveTable[
        coordinate *
          PHASE2_MOVE_COUNT +
          move
      ] =
        encodeCornerPermutation(next)
    }
  }
}

function buildUDEdgePermutationTable() {
  for (
    let coordinate = 0;
    coordinate <
    UD_EDGE_PERMUTATION_COUNT;
    coordinate++
  ) {
    const state =
      coordinatesFromUDEdgePermutation(
        coordinate,
      )

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const next =
        applyCoordinateMove(
          state,
          PHASE2_MOVE_INDICES[move],
        )

      udEdgePermutationMoveTable[
        coordinate *
          PHASE2_MOVE_COUNT +
          move
      ] =
        encodeUDEdgePermutation(next)
    }
  }
}

function buildESlicePermutationTable() {
  for (
    let coordinate = 0;
    coordinate <
    ESLICE_PERMUTATION_COUNT;
    coordinate++
  ) {
    const state =
      coordinatesFromESlicePermutation(
        coordinate,
      )

    for (
      let move = 0;
      move < PHASE2_MOVE_COUNT;
      move++
    ) {
      const next =
        applyCoordinateMove(
          state,
          PHASE2_MOVE_INDICES[move],
        )

      eSlicePermutationMoveTable[
        coordinate *
          PHASE2_MOVE_COUNT +
          move
      ] =
        encodeESlicePermutation(next)
    }
  }
}

let tablesBuilt = false

export function ensurePhase2MoveTables(): void {
  if (tablesBuilt) {
    return
  }

  buildCornerPermutationTable()
  buildUDEdgePermutationTable()
  buildESlicePermutationTable()

  tablesBuilt = true
}